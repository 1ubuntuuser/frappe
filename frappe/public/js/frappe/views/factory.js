// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

frappe.provide("frappe.pages");
frappe.provide("frappe.views");

frappe.views.Factory = class Factory {
	constructor(opts) {
		$.extend(this, opts);
	}

	show() {
		this.route = frappe.get_route();
		this.page_name = frappe.get_route_str();

		if (this.before_show && this.before_show() === false) return;

		if (frappe.pages[this.page_name]) {
			frappe.container.change_to(this.page_name);
			if (this.on_show) {
				this.on_show();
			}
		} else {
			if (this.route[1]) {
				this.make(this.route);
			} else {
				frappe.show_not_found(this.route);
			}
		}
	}

	show_embed(route, page_name) {
		this.route = route;
		this.page_name = page_name;
		if (this.before_show && this.before_show() === false) return;

		if (frappe.pages[this.page_name]) {
			const embed = frappe.container.change_to(this.page_name);
			if (this.on_show) {
				this.on_show();
			}
			return this.page_name;
		} else {
			//this step is not run :(
			if (this.route[1]) {
				this.make(this.route);
			} else {
				frappe.show_not_found(this.route);
			}
			return this.page_name;
		}
	}

	make_page(double_column, page_name) {
		return frappe.make_page(double_column, page_name);
	}
	make_embed(double_column, page_name) {
		return frappe.make_embed(double_column, page_name);
	}
};

frappe.make_page = function (double_column, page_name) {
	if (!page_name) {
		page_name = frappe.get_route_str();
	}

	const page = frappe.container.add_page(page_name);

	frappe.ui.make_app_page({
		parent: page,
		single_column: !double_column,
	});
	frappe.container.change_to(page_name);
	return page;
};

frappe.make_embed = function (double_column, page_name) {
	if (!page_name) {
		page_name = frappe.get_route_str();
	}

	//const embed = $('<div></div>');
	const embed = frappe.container.add_page(page_name);
	frappe.ui.make_app_embed({
		parent: embed,
		single_column: !double_column,
		embed: true,
	});
	frappe.container.show_embed(page_name);
	return embed;
};
