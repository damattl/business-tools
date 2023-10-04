from models.invoice import Invoice


def get_invoice_output_path(invoice: Invoice, extension="docx") -> str:
    return f'invoices/Invoice-{invoice.number}.{extension}'
