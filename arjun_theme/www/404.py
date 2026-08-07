# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE
#
# Guests hitting any URL Frappe can't resolve (typo, stale bookmark, a page
# that was never published) got the stock 404 instead of a way back in.
# Since a guest has nothing useful to do on this site besides log in, send
# them to the login form - preserving where they were headed so a normal
# login still lands them on the right page afterwards.
import frappe


def get_context(context):
	if frappe.session.user == "Guest":
		redirect_to = frappe.local.request.path if hasattr(frappe.local, "request") else "/"
		frappe.local.flags.redirect_location = f"/login?redirect-to={redirect_to}"
		raise frappe.Redirect

	context.http_status_code = 404
