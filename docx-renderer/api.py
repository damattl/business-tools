from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from models.invoice import Invoice
from render import render
from utils import get_invoice_output_path

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/render")
async def handle_render(invoice: Invoice):
    render(invoice)
    filename = f'filename="invoice-{invoice.number}.docx"'
    headers = {'Content-Disposition': 'attachment; ' + filename}
    return FileResponse(
        get_invoice_output_path(invoice),
        headers=headers,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
