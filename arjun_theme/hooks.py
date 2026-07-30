app_name = "arjun_theme"
app_title = "Arjun Theme"
app_publisher = "Arjun"
app_description = "A Frappe Theme"
app_email = "arjuntomar941@gmail.com"
app_license = "mit"

# Apps
# ------------------

# required_apps = []

# Each item in the list will be shown as an app in the apps page
# add_to_apps_screen = [
# 	{
# 		"name": "arjun_theme",
# 		"logo": "/assets/arjun_theme/logo.png",
# 		"title": "Arjun Theme",
# 		"route": "/arjun_theme",
# 		"has_permission": "arjun_theme.api.permission.has_app_permission"
# 	}
# ]

# Includes in <head>
# ------------------

# These files are referenced by a fixed URL (unlike Frappe's own bundled
# desk.bundle.<hash>.css files), so browsers/proxies are free to cache them
# indefinitely once fetched - editing the file doesn't change its URL, so a
# plain reload/rebuild/migrate on the server doesn't guarantee anyone's
# browser actually re-fetches it. _v() appends each file's own mtime as a
# query string so the URL itself changes whenever the file does, forcing a
# fresh fetch automatically on every future update - no manual cache-clear
# ever required again.
import os


def _v(relpath):
    abs_path = os.path.join(os.path.dirname(__file__), "public", relpath)
    try:
        return str(int(os.path.getmtime(abs_path)))
    except OSError:
        return "0"


# include js, css files in header of desk.html
app_include_css = [
    f"/assets/arjun_theme/vendor/simplebar/simplebar.css?v={_v('vendor/simplebar/simplebar.css')}",
    f"/assets/arjun_theme/css/ki_style.css?v={_v('css/ki_style.css')}",
    f"/assets/arjun_theme/css/ki_responsive.css?v={_v('css/ki_responsive.css')}",
    f"/assets/arjun_theme/css/arjun_theme.css?v={_v('css/arjun_theme.css')}",
]
app_include_js = [
    f"/assets/arjun_theme/vendor/simplebar/simplebar.js?v={_v('vendor/simplebar/simplebar.js')}",
    f"/assets/arjun_theme/vendor/animated_icon/iconify-icon.min.js?v={_v('vendor/animated_icon/iconify-icon.min.js')}",
    f"/assets/arjun_theme/js/arjun_theme.js?v={_v('js/arjun_theme.js')}",
]

# include js, css files in header of web template (portal/customer pages)
web_include_css = [
    f"/assets/arjun_theme/css/arjun_portal.css?v={_v('css/arjun_portal.css')}",
]
web_include_js = [
    f"/assets/arjun_theme/vendor/animated_icon/iconify-icon.min.js?v={_v('vendor/animated_icon/iconify-icon.min.js')}",
    f"/assets/arjun_theme/js/arjun_portal.js?v={_v('js/arjun_portal.js')}",
]

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "arjun_theme/public/scss/website"

# favicon shown on the browser tab (Desk, login, portal, everywhere), and
# the logo flashed full-screen by templates/includes/login/login.js right
# after a successful login (Frappe's own splash_screen.html include) —
# without this, it falls back to whichever app's hooks.py sets splash_image,
# which on this bench is ERPNext's own logo.
website_context = {
    "favicon": "/assets/arjun_theme/images/om_favicon.png",
    "splash_image": "/assets/arjun_theme/images/om_favicon.png"
}

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {"Workspace" : "public/js/workspace_icon_picker.js"}


# Website route rewrites
website_route_rules = [
    {"from_route": "/dashboard", "to_route": "portal_dashboard"},
]

# Portal menu items
portal_menu_items = [
    {"title": "Dashboard", "route": "/dashboard", "role": "Customer"},
]

# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "arjun_theme/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "arjun_theme.utils.jinja_methods",
# 	"filters": "arjun_theme.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "arjun_theme.install.before_install"
after_install = "arjun_theme.install.after_install"
after_migrate = "arjun_theme.install.after_migrate"

# Uninstallation
# ------------

# before_uninstall = "arjun_theme.uninstall.before_uninstall"
# after_uninstall = "arjun_theme.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "arjun_theme.utils.before_app_install"
# after_app_install = "arjun_theme.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "arjun_theme.utils.before_app_uninstall"
# after_app_uninstall = "arjun_theme.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "arjun_theme.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"arjun_theme.tasks.all"
# 	],
# 	"daily": [
# 		"arjun_theme.tasks.daily"
# 	],
# 	"hourly": [
# 		"arjun_theme.tasks.hourly"
# 	],
# 	"weekly": [
# 		"arjun_theme.tasks.weekly"
# 	],
# 	"monthly": [
# 		"arjun_theme.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "arjun_theme.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "arjun_theme.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
# 	"Task": "arjun_theme.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["arjun_theme.utils.before_request"]
# after_request = ["arjun_theme.utils.after_request"]

# Job Events
# ----------
# before_job = ["arjun_theme.utils.before_job"]
# after_job = ["arjun_theme.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
# 	{
# 		"doctype": "{doctype_1}",
# 		"filter_by": "{filter_by}",
# 		"redact_fields": ["{field_1}", "{field_2}"],
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_2}",
# 		"filter_by": "{filter_by}",
# 		"partial": 1,
# 	},
# 	{
# 		"doctype": "{doctype_3}",
# 		"strict": False,
# 	},
# 	{
# 		"doctype": "{doctype_4}"
# 	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
# 	"arjun_theme.auth.validate"
# ]

# Automatically update python controller files with type annotations for this app.
# export_python_type_annotations = True

# default_log_clearing_doctypes = {
# 	"Logging DocType Name": 30  # days to retain logs
# }

