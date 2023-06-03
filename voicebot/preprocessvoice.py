import random
import json
from huggingsound import SpeechRecognitionModel
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
import pickle
import torch
device = "cpu"
print("Using {} device".format(device))
datafr=pd.read_csv('C:/Users/Lenovo/Documents/GitHub/darija interpreter/PFA-IDF/voicebot/operations.csv', encoding='ISO-8859-1')
datafr=datafr[["Phrase","Opération"]]
X_fr = datafr['Phrase']
y_fr = datafr['Opération']
vectorizer_fr = TfidfVectorizer()
X_vector_fr = vectorizer_fr.fit_transform(X_fr)


dataar=pd.read_csv('C:/Users/Lenovo/Documents/GitHub/darija interpreter/PFA-IDF/voicebot/commande_darija.csv')
dataar=dataar[["Phrase","Opération"]]
X_ar = dataar['Phrase']
y_ar = dataar['Opération']
vectorizer_ar = TfidfVectorizer()
X_vector_ar = vectorizer_ar.fit_transform(X_ar)


model_ar = SpeechRecognitionModel("C:/Users/Lenovo/Documents/GitHub/darija interpreter/PFA-IDF/voicebot/wav2vec2-large-xlsr-moroccan-darija-test2/",device=device)
model_fr = SpeechRecognitionModel("C:/Users/Lenovo/Documents/GitHub/darija interpreter/PFA-IDF/voicebot/wav2vec2-large-xlsr-53-french/",device=device)

filename3 = "C:/Users/Lenovo/Documents/GitHub/darija interpreter/PFA-IDF/voicebot/trained_modelara.sav"
filename4 = "C:/Users/Lenovo/Documents/GitHub/darija interpreter/PFA-IDF/voicebot/trained_modelfr.sav"
loaded_model3 = pickle.load(open(filename3, 'rb'))
loaded_model4 = pickle.load(open(filename4, 'rb'))
import threading

# Define a function that will be executed in a thread
def get_response(path):
    def task1(path):
        global prediction_ar,proba_ar,prediction_text_ar
        prediction_text_ar = model_ar.transcribe(path)
        phrase_test_vectorized_ar = vectorizer_ar.transform([prediction_text_ar[0]["transcription"]])
        prediction_ar = loaded_model3.predict(phrase_test_vectorized_ar)
        proba_ar = loaded_model3.predict_proba(phrase_test_vectorized_ar)

    def task2(path):
            global prediction_fr,proba_fr,prediction_text_fr
            prediction_text_fr = model_fr.transcribe(path)
            phrase_test_vectorized_fr = vectorizer_fr.transform([prediction_text_fr[0]["transcription"]])
            prediction_fr = loaded_model4.predict(phrase_test_vectorized_fr)
            proba_fr = loaded_model4.predict_proba(phrase_test_vectorized_fr)
    # Create multiple threads
    thread1 = threading.Thread(target=task1(path))
    thread2 = threading.Thread(target=task2(path))

    # Start the threads
    thread1.start()
    thread2.start()

    # Wait for the threads to finish
    thread1.join()
    thread2.join()
    if proba_fr[0].max()>=0.4 or proba_ar[0].max()>=0.4:
        if proba_fr[0].max()>proba_ar[0].max():
            return [prediction_fr[0],"fr",prediction_text_fr[0]["transcription"]]
        else:
            return [prediction_ar[0],"ar",prediction_text_ar[0]["transcription"]]
    else:
        return ["I do not understand..."]
if __name__ == "__main__":
    while True:
        path=input("enter path: ")
        print(get_response(path))

