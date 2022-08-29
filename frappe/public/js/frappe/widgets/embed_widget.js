//Code adapted from https://github.com/editor-js/embed (MIT)
import Widget from "./base_widget.js";
import Embed from './../views/workspace/blocks/embed.js';
//import './../router.js'

//import { debounce } from 'debounce';
//npm install debounce was required
frappe.provide("frappe.utils");

export default class EmbedWidget extends Widget {
	constructor(opts) {
		opts.shadow = true;
		super(opts);
		//this.height = this.i_height || 240;
	}

	get_config() {
		return {
			document_type: this.document_type,
			label: this.label,
			service: this.service,
			source: this.source,
			embed: this.embed,
			i_width: this.i_width,
			i_height: this.i_height,
			caption: this.caption
			//embed_filter: this.embed_filter
		};
	}

	//these are the buttons on top of the widget.
	set_actions() {
		if (this.in_customize_mode) return;
		this.setup_refresh_list_button();
	}

	setup_refresh_list_button() {
		this.refresh_list = $(
			`<div class="refresh-list btn btn-xs pull-right" title="${__("Refresh List")}">
				${frappe.utils.icon('refresh', 'sm')}
			</div>`
		);

		this.refresh_list.appendTo(this.action_area);
		this.refresh_list.on("click", () => {
			this.body.empty();
			this.set_body();
		});
	}

	render_embed(path) {
		// create the page generator (factory) object and call `show`
		// if there is no generator, render the `Page` object
		debugger;
		const route = frappe.router.get_route(path);
		route.push("embed");
		const factory = frappe.utils.to_title_case(route[0]);

		if (route[1] && frappe.views[factory + "Factory"]) {
			route[0] = factory;
			// has a view generator, generate!
			if (!frappe.view_factory[factory]) {
				frappe.view_factory[factory] = new frappe.views[factory + "Factory"]();
			}

			//frappe.view_factory[factory].make_embed();
			return frappe.make_embed(false,'List/Project/Kanban/Products')
		} else {
			// show page
			const route_name = frappe.utils.xss_sanitise(route[0]);
			if (frappe.views.pageview) {
				frappe.views.pageview.show(route_name);
			}
		}
	}

	/**
   * Checks that mutations in DOM have finished after appending iframe content
   *
   * @param {HTMLElement} targetNode - HTML-element mutations of which to listen
   * @returns {Promise<any>} - result that all mutations have finished
   */
	embedIsReady(targetNode) {
		const PRELOADER_DELAY = 450;

		let observer = null;

		return new Promise((resolve, reject) => {
			//observer = new MutationObserver(debounce(resolve, PRELOADER_DELAY));
			observer = new MutationObserver(resolve);
			observer.observe(targetNode, {
				childList: true,
				subtree: true,
			});
		}).then(() => {
			observer.disconnect();
		});
	}

	set_body() {
		this.widget.addClass("quick-list-widget-box");
		let meta = frappe.get_meta(this.document_type);
		if (!this.service) {
			this.loading = $(
				`<div class="chart-loading-state text-muted" style="height: ${this.height}px;">${__(
					"No service selected..."
				)}</div>`
			);
			this.body.empty();
			this.loading.appendTo(this.body);
		} 

		if (!this.source) {
			this.loading = $(
				`<div class="chart-loading-state text-muted" style="height: ${this.height}px;">${__(
					"No source address entered"
				)}</div>`
			);
			this.body.empty();
			this.loading.appendTo(this.body);
		}

		this.loading = $(
			`<div class="chart-loading-state text-muted" style="height: ${this.height}px;">${__(
				"Loading..."
			)}</div>`
		);
		this.loading.appendTo(this.body);

		try {

			const { regex, embedUrl, width, height, id = (ids) => ids.shift() } = Embed.services[this.service];
			if (this.service != 'view') {
				const result = regex.exec(this.source).slice(1);
				this.embed = embedUrl.replace(/<%= remote_id %>/g, id(result));
			}
			this._data = {
				service: this.service,
				source: this.source,
				embed: this.embed,
				width: this.i_width,
				i_height: this.i_height,
				caption: this.caption || '',
			};
			if (!this.service) {
				const container = document.createElement('div');
				//this.wrapper = container;
				return container;
			}

			
			//not sure how to enable this
			//if (Embed.checkServiceConfig(regex, embedUrl, width, height, id )) {
			//	window.alert('yay!')
			//};

			const container = document.createElement('div');
			const caption = document.createElement('div');
			const template = document.createElement('template');
			caption.contentEditable = false;
			caption.innerHTML = this.caption || '';

			if (this.service != 'view') {
				const { html } = Embed.services[this.service];
				template.innerHTML = html;
				template.content.firstChild.setAttribute('src', this.embed);
				template.content.firstChild.setAttribute('height', this.i_height);
				template.content.firstChild.setAttribute('width', this.i_width);
			} else {
				const htmlEmbed = this.render_embed(this.source);
				template.innerHTML = htmlEmbed.innerHTML;
			}

			const embedIsReady = this.embedIsReady(container);
			container.appendChild(template.content.firstChild);
			container.appendChild(caption);
			embedIsReady
				.then(() => {
					this.body.remove(".chart-loading-state");
				});
			this.body.empty();
			this.wrapper = $(`<div>` + container.innerHTML + `</div>`);
			this.wrapper.appendTo(this.body);

		} catch (error) {
			this.body.empty();
			//not sure if this is best practice but will at least inform the user something went wrong.
			frappe.msgprint(error + " - Check embed source field is correct");
		}
	
	}

}
