# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import tensorflow as tf
from tensorflow.keras.utils import to_categorical
import pickle
import warnings
warnings.filterwarnings('ignore')

# ============================================================================
# CONFIGURATION
# ============================================================================
CONFIG = {
    'csv_file': 'data_processed.csv',
    'model_path': 'model.h5',
    'tokenizer_path': 'tokenizer.pkl',
    'bert_models': [
        'dangvantuan/sentence-camembert-large',
        'OrdalieTech/Solon-embeddings-large-0.1',
        'paraphrase-multilingual-MiniLM-L12-v2'
    ],
    'batch_size': 32,
    'test_size': 0.2,
    'random_state': 42
}

# ============================================================================
# CORE MODULES
# ============================================================================

class BertEmbedder:
    """Handles BERT model loading and text embedding"""
    
    @staticmethod
    def load_model():
        """Load optimal BERT model"""
        try:
            from sentence_transformers import SentenceTransformer
            for model_name in CONFIG['bert_models']:
                try:
                    return SentenceTransformer(model_name)
                except:
                    continue
        except ImportError:
            print("Install: pip install sentence-transformers")
        return None

class DataProcessor:
    """Process and prepare dataset"""
    
    def __init__(self, csv_file):
        self.df = self._load_data(csv_file)
        self.bert_model = BertEmbedder.load_model()
        
    def _load_data(self, csv_file):
        """Load CSV with encoding fallback"""
        try:
            return pd.read_csv(csv_file, encoding='utf-8')
        except UnicodeDecodeError:
            return pd.read_csv(csv_file, encoding='latin-1')
    
    def clean_data(self):
        """Clean and preprocess data"""
        if 'text_bert' not in self.df.columns:
            raise ValueError("Missing 'text_bert' column")
        
        self.df = self.df.dropna(subset=['text_bert', 'sentiment'])
        self.df['probleme'] = self.df['probleme'].fillna('non_applicable')
        
        # Business logic: non-negative = no problem
        mask = self.df['sentiment'] != 'negatif'
        self.df.loc[mask, 'probleme'] = 'non_applicable'
        
        return self
    
    def generate_embeddings(self):
        """Generate BERT embeddings"""
        if self.bert_model is None:
            raise RuntimeError("BERT model not loaded")
        
        texts = self.df['text_bert'].tolist()
        embeddings = []
        
        for i in range(0, len(texts), CONFIG['batch_size']):
            batch = texts[i:i+CONFIG['batch_size']]
            embeddings.extend(self.bert_model.encode(batch))
        
        return np.array(embeddings)
    
    def encode_labels(self):
        """Encode sentiment and problem labels"""
        sent_encoder = LabelEncoder()
        prob_encoder = LabelEncoder()
        
        y_sent = to_categorical(sent_encoder.fit_transform(self.df['sentiment']))
        y_prob = to_categorical(prob_encoder.fit_transform(self.df['probleme']))
        
        return y_sent, y_prob, sent_encoder, prob_encoder

# ============================================================================
# EVALUATION MODULE
# ============================================================================

class ModelEvaluator:
    """Evaluate model performance"""
    
    @staticmethod
    def evaluate_model(model, X_test, y_sent_test, y_prob_test, sent_encoder, prob_encoder):
        """Run comprehensive evaluation"""
        # Predictions
        sent_pred, prob_pred = model.predict(X_test, verbose=0)
        sent_pred_classes = np.argmax(sent_pred, axis=1)
        prob_pred_classes = np.argmax(prob_pred, axis=1)
        
        # Convert true labels
        sent_true = np.argmax(y_sent_test, axis=1)
        prob_true = np.argmax(y_prob_test, axis=1)
        
        # Calculate metrics
        results = {
            'sentiment': ModelEvaluator._calculate_metrics(
                sent_true, sent_pred_classes, sent_encoder, 'Sentiment'
            ),
            'problem': ModelEvaluator._calculate_metrics(
                prob_true, prob_pred_classes, prob_encoder, 'Problem'
            )
        }
        
        return results
    
    @staticmethod
    def _calculate_metrics(true_labels, pred_labels, encoder, task_name):
        """Calculate classification metrics"""
        accuracy = accuracy_score(true_labels, pred_labels)
        
        print(f"\n{task_name.upper()} ANALYSIS")
        print("-" * 30)
        print(f"Accuracy: {accuracy:.2%}")
        print("\nDetailed Report:")
        print(classification_report(
            true_labels, pred_labels,
            target_names=encoder.classes_,
            digits=3
        ))
        
        return {
            'accuracy': accuracy,
            'confusion_matrix': confusion_matrix(true_labels, pred_labels),
            'class_names': encoder.classes_
        }
    
    @staticmethod
    def plot_results(results):
        """Generate confusion matrices"""
        fig, axes = plt.subplots(1, 2, figsize=(14, 6))
        
        # Sentiment confusion matrix
        ModelEvaluator._plot_cm(
            results['sentiment']['confusion_matrix'],
            results['sentiment']['class_names'],
            'Sentiment Confusion Matrix',
            axes[0]
        )
        
        # Problem confusion matrix
        ModelEvaluator._plot_cm(
            results['problem']['confusion_matrix'],
            results['problem']['class_names'],
            'Problem Confusion Matrix',
            axes[1]
        )
        
        plt.tight_layout()
        plt.savefig('confusion_matrices.png', dpi=150, bbox_inches='tight')
        plt.show()
    
    @staticmethod
    def _plot_cm(matrix, class_names, title, ax):
        """Plot single confusion matrix"""
        matrix_norm = matrix.astype('float') / (matrix.sum(axis=1)[:, np.newaxis] + 1e-8)
        sns.heatmap(
            matrix_norm,
            annot=True,
            fmt='.2f',
            cmap='Blues',
            xticklabels=class_names,
            yticklabels=class_names,
            cbar_kws={'label': 'Proportion'},
            ax=ax,
            square=True
        )
        ax.set_title(title, fontweight='bold')
        ax.set_xlabel('Predicted')
        ax.set_ylabel('Actual')

# ============================================================================
# MAIN PIPELINE
# ============================================================================

class TrainingPipeline:
    """Main training and evaluation pipeline"""
    
    @staticmethod
    def run():
        """Execute complete pipeline"""
        print("🚀 BERT Model Training Pipeline")
        print("=" * 40)
        
        # 1. Load and process data
        print("\n1. Loading data...")
        processor = DataProcessor(CONFIG['csv_file'])
        processor.clean_data()
        
        X = processor.generate_embeddings()
        y_sent, y_prob, sent_encoder, prob_encoder = processor.encode_labels()
        
        # 2. Load model
        print("\n2. Loading trained model...")
        model = tf.keras.models.load_model(CONFIG['model_path'])
        
        # 3. Train-test split
        print("\n3. Splitting data...")
        stratify = np.argmax(y_sent, axis=1)
        splits = train_test_split(
            X, y_sent, y_prob,
            test_size=CONFIG['test_size'],
            random_state=CONFIG['random_state'],
            stratify=stratify
        )
        X_train, X_test, y_sent_train, y_sent_test, y_prob_train, y_prob_test = splits
        
        # 4. Save tokenizer
        print("\n4. Saving tokenizer...")
        TrainingPipeline._save_tokenizer(
            sent_encoder, prob_encoder, processor.bert_model
        )
        
        # 5. Evaluate
        print("\n5. Evaluating model...")
        results = ModelEvaluator.evaluate_model(
            model, X_test, y_sent_test, y_prob_test,
            sent_encoder, prob_encoder
        )
        
        # 6. Visualize
        ModelEvaluator.plot_results(results)
        
        # 7. Summary
        TrainingPipeline._print_summary(results)
        
        return results
    
    @staticmethod
    def _save_tokenizer(sent_encoder, prob_encoder, bert_model):
        """Save tokenizer with metadata"""
        tokenizer_data = {
            'sentiment_encoder': sent_encoder,
            'problem_encoder': prob_encoder,
            'model_info': {
                'type': 'sentence_bert',
                'embedding_dim': bert_model.get_sentence_embedding_dimension()
            }
        }
        
        with open(CONFIG['tokenizer_path'], 'wb') as f:
            pickle.dump(tokenizer_data, f)
        
        print(f"Tokenizer saved to {CONFIG['tokenizer_path']}")
    
    @staticmethod
    def _print_summary(results):
        """Print final summary"""
        print("\n" + "=" * 40)
        print("📊 FINAL RESULTS")
        print("=" * 40)
        print(f"Sentiment Accuracy:  {results['sentiment']['accuracy']:.2%}")
        print(f"Problem Accuracy:    {results['problem']['accuracy']:.2%}")
        print("\n📁 Files generated:")
        print(f"  • {CONFIG['tokenizer_path']}")
        print(f"  • confusion_matrices.png")

# ============================================================================
# EXECUTION
# ============================================================================

if __name__ == "__main__":
    results = TrainingPipeline.run()