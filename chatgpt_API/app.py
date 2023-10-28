from fastapi import FastAPI
from pydantic import BaseModel
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
from fastapi.middleware.cors import CORSMiddleware


model_name = "facebook/blenderbot-400M-distill"
model = BlenderbotForConditionalGeneration.from_pretrained(model_name)
tokenizer = BlenderbotTokenizer.from_pretrained(model_name)

app = FastAPI()


class MessageInput(BaseModel):
    message: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with the origins you want to allow or "*" for all
    allow_credentials=True,
    allow_methods=["*"],  # Replace with the HTTP methods you want to allow or "*" for all
    allow_headers=["*"],  # Replace with the HTTP headers you want to allow or "*" for all
)


@app.post("/process_message/")
def process_message(message_input: MessageInput):
    input_text = message_input.message

    inputs = tokenizer([input_text], return_tensors="pt")
    reply_ids = model.generate(**inputs, do_sample=True, top_p=0.92, top_k=50)
    response_text = tokenizer.batch_decode(reply_ids, skip_special_tokens=True)

    return {"response": response_text}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)