from models.invoice import Invoice


def get_invoice_output_path(invoice: Invoice) -> str:
    return f'invoices/invoice-{invoice.number}.docx'
