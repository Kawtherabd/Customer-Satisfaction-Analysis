
# 📊 Customer Satisfaction Analysis from Social Media using Deep Learning

## 📌 Project Overview

This project focuses on analyzing customer satisfaction from social media data using deep learning techniques.  
The objective is to automatically extract, preprocess, and analyze user opinions expressed on social networks in order to assess customer satisfaction and identify major issues reported by users.

A key originality of this project is the implementation of a two-level (double) classification approach, combining sentiment analysis with problem-type classification.

The project follows a complete data science pipeline, from data collection to sentiment prediction, making it a strong example of applied NLP in a real-world context.

---

## Objectives

- Collect customer opinions from social media platforms  
- Clean and preprocess unstructured textual data  
- Apply Natural Language Processing (NLP) techniques  
- Build and evaluate deep learning classification models  
- Perform sentiment classification (Positive, Negative, Neutral)  
- Identify and classify problem types in negative customer feedback  

---

## Project Pipeline

### 1️⃣ Data Collection
- Extraction of customer comments from social media platforms
- Raw textual data stored for further processing

### 2️⃣ Data Preprocessing
- Text cleaning (removal of noise, symbols, URLs, emojis)
- Tokenization
- Stop-word removal
- Text normalization

### 3️⃣ Feature Representation
- Transformation of text into numerical representations
- Use of NLP techniques suitable for deep learning models

### 4️⃣ Model Architecture
- Deep learning–based classification models
- Implementation of a double classification strategy:
  - **First-level classification**: sentiment polarity (Positive / Negative / Neutral)
  - **Second-level classification**: problem type classification applied only to negative opinions

### 5️⃣ Training & Evaluation
- Model training on labeled datasets
- Performance evaluation using appropriate metrics
- Analysis and discussion of results for both classification levels

### 6️⃣ Prediction & Analysis
- Prediction of customer satisfaction level
- Identification of dominant problem categories in negative feedback
- Interpretation of sentiment and issue trends

---

## Technologies & Tools

   ### Programming Language
       - Python

   ### Data Science & AI
       - Pandas
       - NumPy
       - PyTorch / TensorFlow
       - NLP libraries (NLTK, spaCy)
       - Deep Learning models for text classification

  ### Data Handling
       - Data cleaning & preprocessing
       - Text normalization
       - Sentiment analysis
       - Problem-type classification

  ### Development Environment
       - Google Colab
       - Jupyter Notebook

⚠️ Ethical Notice  
Data collection was conducted for academic research purposes only.  
To respect platform policies and data privacy, the web scraping scripts and raw collected data are not publicly shared.

