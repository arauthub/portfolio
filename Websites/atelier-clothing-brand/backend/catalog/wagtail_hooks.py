from wagtail import hooks
from django.utils.safestring import mark_safe

@hooks.register('insert_global_admin_css')
def global_admin_css():
    return mark_safe(
        """
        <style>
            :root {
                --w-color-primary: #C19A6B;
                --w-color-primary-text: #0A0B0E;
            }
            .sidebar-main-menu {
                background: #0f1117 !important;
            }
            .sidebar-brand__logo {
                font-family: 'Playfair Display', serif;
                font-weight: 700;
                letter-spacing: 2px;
            }
            .w-header__title {
                font-family: 'Playfair Display', serif;
            }
            .atelier-status-badge {
                padding: 4px 10px;
                border-radius: 9999px;
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .badge-live { background: #10B981; color: white; }
            .badge-low-stock { background: #F59E0B; color: white; }
        </style>
        """
    )
