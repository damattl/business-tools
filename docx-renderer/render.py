import locale

import docxtpl
from models.invoice import Invoice
from utils import get_invoice_output_path

locale.setlocale(locale.LC_ALL, 'de_DE.UTF-8')


def generate_context(invoice: Invoice) -> dict[str, str]:
    item_list = []
    for i in range(len(invoice.items)):
        item = invoice.items[i]
        item_list.append({
            'position': i + 1,
            'product': item.productName,
            'amount': item.amount,
            'price': locale.format_string("%.2f", item.price),
            'total': locale.format_string("%.2f", item.total),
        })

    context = {
        'customer_first_name': invoice.customer.firstName,
        'customer_last_name': invoice.customer.lastName,
        'customer_address_1': invoice.customer.address.street + " " + invoice.customer.address.streetNr,
        'customer_address_2': invoice.customer.address.postalCode + " " + invoice.customer.address.city,
        'invoice_number': invoice.number,
        'invoice_items': item_list,
        'invoice_total': locale.format_string("%.2f", invoice.total)
    }
    return context


def render(invoice: Invoice):
    doc = docxtpl.DocxTemplate("templates/default-invoice.docx")
    context = generate_context(invoice)
    doc.render(context)
    doc.save(get_invoice_output_path(invoice))
