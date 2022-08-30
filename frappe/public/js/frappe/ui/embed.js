// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

//Changes in here should be merged back into page.js and page.html to prevent double up of most of the code.

/**
 * Make a standard page layout with a toolbar and title
 *
 * @param {Object} opts
 *
 * @param {string} opts.parent [HTMLElement] Parent element
 * @param {boolean} opts.single_column Whether to include sidebar
 * @param {string} [opts.title] Page title
 * @param {Object} [opts.make_page]
 *
 * @returns {frappe.ui.Embed}
 */

/**
 * @typedef {Object} frappe.ui.Embed
 */

frappe.ui.make_app_embed = function (opts) {
	opts.parent.page = new frappe.ui.Embed(opts);
	return opts.parent.page;
};

//frappe.ui.pages = {};

frappe.ui.Embed = class Embed extends frappe.ui.Page {
	constructor(opts) {
		super(opts);
		this.set_document_title = true;
	}

	add_custom_button_group(label, icon, parent) {
		let dropdown_label = `<span class="hidden-xs">
			<span class="custom-btn-group-label">${__(label)}</span>
			${frappe.utils.icon("select", "xs")}
		</span>`;

		if (icon) {
			dropdown_label = `<span class="hidden-xs">
				${frappe.utils.icon(icon)}
				<span class="custom-btn-group-label">${__(label)}</span>
				${frappe.utils.icon("select", "xs")}
			</span>
			<span class="visible-xs">
				${frappe.utils.icon(icon)}
			</span>`;
		}

		let custom_btn_group = $(`
			<div class="custom-btn-group">
				<button type="button" class="btn btn-default btn-sm ellipsis" data-toggle="dropdown" aria-expanded="false">
					${dropdown_label}
				</button>
				<ul class="dropdown-menu" role="menu"></ul>
			</div>
		`);

		if (!parent) parent = this.custom_actions;
		//dissabled for now as switching views breaks stuff.
		//parent.removeClass("hide").append(custom_btn_group);

		return custom_btn_group.find(".dropdown-menu");
	}

	add_main_section() {
		$(frappe.render_template("embed", {})).appendTo(this.wrapper);
		if (this.single_column) {
			// nesting under col-sm-12 for consistency
			this.add_view(
				"main",
				'<div class="row layout-main">\
					<div class="col-md-12 layout-main-section-wrapper">\
						<div class="layout-main-section"></div>\
						<div class="layout-footer hide"></div>\
					</div>\
				</div>'
			);
		} else {
			this.add_view(
				"main",
				`
				<div class="row layout-main">
					<div class="col-lg-2 layout-side-section"></div>
					<div class="col layout-main-section-wrapper">
						<div class="layout-main-section"></div>
						<div class="layout-footer hide"></div>
					</div>
				</div>
			`
			);
		}
		this.setup_page();
	}
	//hide sidebar as default
	// setup_sidebar_toggle() {
	// 	super();
	// 	let sidebar_wrapper = this.wrapper.find(".layout-side-section");
	// 	sidebar_wrapper.toggle();
	// }
};
