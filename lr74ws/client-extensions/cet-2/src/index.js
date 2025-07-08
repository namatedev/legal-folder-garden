import React from 'react';
import {createRoot} from 'react-dom/client';

const App = ({route}) => {
	
	return (
		<div>
			Hello
		</div>
	);
};

class WebComponent extends HTMLElement {
	connectedCallback() {
		this.root = createRoot(this);

		this.root.render(<App route={this.getAttribute('route')} />, this);
	}

	disconnectedCallback() {

		this.root.unmount();
		delete this.root;
	}
}

const ELEMENT_ID = 'cet-2';

if (!customElements.get(ELEMENT_ID)) {
	customElements.define(ELEMENT_ID, WebComponent);
}
