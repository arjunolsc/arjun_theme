import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields

def after_install():
    create_custom_fields({
        "Workspace": [
            {
                "fieldname": "custom_animated_icon",
                "label": "Animated Icon",
                "fieldtype": "Data",
                "insert_after": "icon",
                "description": "Iconify icon code (e.g. mdi:home)"
            }
        ]
    })
    set_favicon()

def after_migrate():
    after_install()

def set_favicon():
    """Point Website Settings at the favicon bundled with this app so the
    browser tab icon works out of the box on any bench, with no manual
    site configuration."""
    favicon = "/assets/arjun_theme/images/om_favicon.png"
    if frappe.db.get_single_value("Website Settings", "favicon") != favicon:
        frappe.db.set_single_value("Website Settings", "favicon", favicon)
