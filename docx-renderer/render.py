import asyncio
import locale
import os.path
import time
from os.path import join

import docxtpl
import pdfgen
import collections
from jinja2 import Environment, PackageLoader, select_autoescape
from models.invoice import Invoice
from utils import get_invoice_output_path
collections.Iterable = collections.abc.Iterable

locale.setlocale(locale.LC_ALL, 'de_DE.UTF-8')

pdfgen_options = {
    'format': 'A4'
}


def generate_render_context(invoice: Invoice) -> dict[str, str]:
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
        'customer_title': invoice.customer.title,
        'customer_first_name': invoice.customer.firstName,
        'customer_last_name': invoice.customer.lastName,
        'customer_address_1': invoice.customer.address.street + " " + invoice.customer.address.streetNr,
        'customer_address_2': invoice.customer.address.postalCode + " " + invoice.customer.address.city,
        'invoice_number': invoice.number,
        'invoice_date': invoice.date,
        'invoice_items': item_list,
        'invoice_total': locale.format_string("%.2f", invoice.total)
    }
    return context


def render_html(invoice: Invoice) -> str:
    env = Environment(
        loader=PackageLoader("main"),
        autoescape=select_autoescape()
    )
    template = env.get_template("default-invoice.html")
    context = generate_render_context(invoice)
    return template.render(context)


def render_docx(invoice: Invoice) -> str:
    doc = docxtpl.DocxTemplate("templates/default-invoice.docx")
    context = generate_render_context(invoice)
    doc.render(context)
    output_path = get_invoice_output_path(invoice)
    doc.save(output_path)
    return output_path








