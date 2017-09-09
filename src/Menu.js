let React = require('react');

let ToolButton = require('./ToolButton');

let Map = require('./Map');

let components = {};

let tool_info = fetch('data/tools.txt').then(response => {
	return new Promise(resolve => {
		response.text().then(str => {
			let tools = str.split('\n')
                                .filter(Boolean) // filter out blank lines
				.map(tool => tool.split('|'));

			tools.forEach(tool => components[tool[2]] = require(`./tools/${tool[2]}`));

			resolve(tools);
		});
	});
});

class Menu extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			focused: false,
			tools: [],
			visible_tools: [],
			active_component: null
		}
		
		this.search = this.search.bind(this);
		this.select_tool = this.select_tool.bind(this);
		this.set_visible_tools = this.set_visible_tools.bind(this);
		this.on_select = this.on_select.bind(this);
		this.on_remove = this.on_remove.bind(this);
		this.on_search_focus = this.on_search_focus.bind(this);
		this.listen = this.listen.bind(this);
		
		Map.subscribe(this);
	}

	componentDidMount() {
		tool_info.then(tools => {
			this.setState({ tools });
			this.set_visible_tools();
		});
	}

	search(event) {
		let value = event.target.value;
		console.log(value);
	} 

	select_tool(tool) {
		console.log('selecting tool...');
	}

	on_select(component_name) {
		this.setState({ active_component: components[component_name] });
	}

	on_search_focus() {
		this.setState({ focused: true });
	}

	listen(event_type, message) {
		this.setState({ focused: false })
	}

	set_visible_tools() {

		// for now just set it to all tools but need a search algorithm
		this.setState({
			visible_tools: this.state.tools
		})
	}

	on_remove() {
		this.setState({ active_component: null });
	}

	render() {
		return (
			<div id='menu'>
				<header id='menu-header'>
					<h3>GeoTIFF.io</h3>
				</header>
				<section id='search'>
					<form action={this.select_tool}>
						<input 
							id='search-input'
							className='gt-input'
							type='text'
							placeholder='Search Tools'
							onChange={this.search}
							onFocus={this.on_search_focus}
						/>
					</form>
				</section>
				<section id='content' className={this.state.focused ? 'focus' : ''}>
					{ 
						this.state.active_component 
						? React.createElement(this.state.active_component, { on_remove: this.on_remove })
						: <div id='tool-button-container'>
							{ 
								this.state.visible_tools.map(tool => {
									return <ToolButton 
										key={tool[0]}
										name={tool[0]} 
										icon={tool[1]}
										component={tool[2]}
										on_select={this.on_select}
									/>
								})
							}
						</div>
					}

				</section>
			</div>
		)
	}
}

module.exports = Menu;
