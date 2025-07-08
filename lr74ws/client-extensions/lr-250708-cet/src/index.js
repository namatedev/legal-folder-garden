import React from 'react';
import {createRoot} from 'react-dom/client';

const App = ({route}) => {
	
	return (
		<div>
			HELLO HI 4
		</div>
	);
};

class WebComponent extends HTMLElement {
	connectedCallback() {
		this.root = createRoot(this);

		this.root.render(<App route={this.getAttribute('route')} />, this);

		if (Liferay.ThemeDisplay.isSignedIn()) {
			api('o/headless-admin-user/v1.0/my-user-account')
				.then((response) => response.json())
				.then((response) => {
					if (response.givenName) {
						const nameElements = document.getElementsByClassName(
							'hello-world-name'
						);

						if (nameElements.length) {
							nameElements[0].innerHTML = response.givenName;
						}
					}
				})
				.catch((error) => {
					// eslint-disable-next-line no-console
					console.log(error);
				});
		}
	}

	disconnectedCallback() {

		//
		// Unmount React tree to prevent memory leaks.
		//
		// See React documentation at
		//
		//     https://react.dev/reference/react-dom/client/createRoot#root-unmount
		//
		// for more information.
		//

		this.root.unmount();
		delete this.root;
	}
}

const ELEMENT_ID = 'lr-250708-cet';

if (!customElements.get(ELEMENT_ID)) {
	customElements.define(ELEMENT_ID, WebComponent);
}
