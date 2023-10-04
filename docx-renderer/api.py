from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from models.invoice import Invoice
from render import render_docx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/render/docx")
def handle_render(invoice: Invoice):
    output_path = render_docx(invoice)
    filename = f'filename="Invoice-{invoice.number}.docx"'
    headers = {'Content-Disposition': 'attachment; ' + filename}
    print(invoice)
    return FileResponse(
        output_path,
        headers=headers,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )


