import json, wave
import numpy as np
from faster_whisper import WhisperModel
w_=wave.open("work/audio.wav");audio=np.frombuffer(w_.readframes(w_.getnframes()),dtype=np.int16).astype(np.float32)/32768.0
m = WhisperModel("small", device="cpu", compute_type="int8")
segs, info = m.transcribe(audio, word_timestamps=True, language="en", no_speech_threshold=0.9, log_prob_threshold=-2.0, vad_filter=False,
    initial_prompt="Umm, uh, aaa, so, like, you know. Hmm.", condition_on_previous_text=False)
words=[]
segs=list(segs)
for s in segs: print(round(s.start,1),round(s.end,1),round(s.no_speech_prob,2),s.text)
for s in segs:
    for w in s.words:
        words.append({"w":w.word.strip(),"s":round(w.start,3),"e":round(w.end,3),"p":round(w.probability,2)})
json.dump({"lang":info.language,"words":words},open("work/words.json","w"),indent=1)
print(info.language, len(words))
