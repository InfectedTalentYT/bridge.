<template>
	<v-app :style="{
		background: $vuetify.theme.themes[theme_variant].background,
		fontSize: $store.state.Settings.ui_font_size || '14px',
		fontFamily:
			$store.state.Settings.ui_font_family || 'Roboto, sans-serif',
	}">
		<Toolbar />
		<SidebarNavigation />

		<v-main :style="`padding-bottom: 32px;`">
			<v-row style="height: 100%;" no-gutters>
				<v-col v-if="isSidebarOpen" cols="2">
					<SidebarMain />
				</v-col>
				<v-col @click="setSplitScreen(false)" :style="`border-right: 1px solid ${is_dark_mode
						? 'rgba(255, 255, 255, 0.12)'
						: 'rgba(0, 0, 0, 0.12)'
					} !important;`
					" :cols="5 +
		5 * !has_split_screen +
		(1 + 1 * !has_split_screen) * !isSidebarOpen
		" ref="file_container">
					<EditorShellTabSystem />
					<EditorShellContentManager />
				</v-col>
				<v-col @click="setSplitScreen(true)" v-if="has_split_screen" :cols="5 + 1 * !isSidebarOpen">
					<EditorShellTabSystem :split_screen="true" />
					<EditorShellContentManager :split_screen="true" />
				</v-col>
			</v-row>
		</v-main>

		<WindowFactoryMain />
		<ContextMenuMain />
		<JsonEditorHoverCard />
		<CollectedWindows />

		<Footer />
	</v-app>
</template>

<script>
import Toolbar from './src/UI/Toolbar/Main'
import SidebarNavigation from './src/UI/Sidebar/Navigation'
import SidebarMain from './src/UI/Sidebar/Main'
import EditorShellTabSystem from './src/UI/Editor/TabSystem'
import JsonEditorHoverCard from './src/UI/Editor/JsonEditor/HoverCard'
import EditorShellContentManager from './src/UI/Editor/TabContentManager'
import WindowFactoryMain from './src/UI/Windows/Renderer/Main'
import Footer from './src/UI/Footer/Main'
import ContextMenuMain from './src/UI/ContextMenu/Main'
import CollectedWindows from './src/UI/Windows/Collect'

import { shell } from 'electron'
import startUp from './src/AppCycle/startUp'
import EventBus from './src/EventBus'
import Vue from 'vue'
import TabSystem from './src/TabSystem'
import { SidebarState } from './src/UI/Sidebar/state'

export default {
	name: 'bridge',
	components: {
		Toolbar,
		SidebarNavigation,
		SidebarMain,
		EditorShellTabSystem,
		EditorShellContentManager,
		WindowFactoryMain,
		Footer,
		ContextMenuMain,
		JsonEditorHoverCard,
		CollectedWindows,
	},
	async created() {
		this.$vuetify.theme.dark = this.$store.state.Appearance.is_dark_mode
		startUp()

		EventBus.on('bridge:applyTheme', theme => {
			if (theme === undefined || theme.definition === undefined) return
			const {
				light: { highlighter: highlighter_light, ...light },
				dark: { highlighter: highlighter_dark, ...dark },
			} = theme.definition

			Vue.set(
				this.$vuetify.theme.themes,
				'light',
				Object.assign(
					this.$vuetify.theme.themes.light,
					theme.definition.light || {}
				)
			)
			Vue.set(
				this.$vuetify.theme.themes,
				'dark',
				Object.assign(
					this.$vuetify.theme.themes.dark,
					theme.definition.dark || {}
				)
			)
			this.$store.commit('setColorTheme', {
				light: highlighter_light,
				dark: highlighter_dark,
				update_styles: theme.update_styles,
			})
		})
		EventBus.on('updateTabUI', this.updateSplitScreen)
		EventBus.on('bridge:getFileContainerWidth', () => {
			try {
				return this.$refs.file_container.getBoundingClientRect().width
			} catch {
				return 0
			}
		})

		//Disable middle-mouse scrolling
		window.addEventListener('mousedown', event => {
			if (event.button === 1) event.preventDefault()
		})
	},
	computed: {
		isSidebarOpen() {
			return SidebarState.currentState !== null
		},
		is_dark_mode() {
			return this.$store.state.Appearance.is_dark_mode
		},
		theme_variant() {
			return this.$vuetify.theme.dark ? 'dark' : 'light'
		},
		project_name() {
			return this.$store.state.Explorer.project.explorer
		},
	},
	watch: {
		is_dark_mode(to) {
			this.$vuetify.theme.dark = to
		},
		project_name(to) {
			document.head.getElementsByTagName('title')[0].innerText = `${to ? to + ' - ' : ''
				}bridge.`
		},
	},
	data() {
		return {
			content: '',
			file: '',
			path: '',
			has_split_screen: false,
		}
	},
	methods: {
		openTwitter() {
			shell.openExternal('https://twitter.com/solvedDev');
		},
		updateSplitScreen() {
			this.has_split_screen =
				TabSystem.getCurrentProjects(true).length > 0
		},
		setSplitScreen(val) {
			TabSystem.split_screen_active = val;
		},
	},
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700');

/* Global CSS */
html {
	overflow: hidden;
	overscroll-behavior: contain;
}

body {
	overflow: unset;
}

* {
	outline-color: var(--v-primary-base);
}

/* SCROLLBAR */
*::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}

*::-webkit-scrollbar-track {
	box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.5);
}

*::-webkit-scrollbar-thumb {
	background-color: rgba(0, 0, 0, 0.35);
	box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.4);
}

/* NO TEXT SELECTION */
:root {
	-moz-user-select: none;
	-khtml-user-select: none;
	-webkit-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

v-application--wrap>main.v-content {
	padding-left: 60px !important;
}

.v-application .subtitle-1 {
	font-family: unset !important;
}

.v-system-bar {
	padding-right: 0;
}

.v-system-bar .v-icon {
	margin: 0;
}

.json-input-suggestions .v-list-item,
.small-list .v-list-item {
	min-height: 28px !important;
}

.json-input-suggestions .v-list-item__content,
.small-list .v-list-item__content {
	padding: 4px 0 !important;
}

.v-list {
	background: var(--v-menu-base) !important;
	border-radius: 0px;
}
</style>

<style scoped>
.no-padding {
	padding: 0;
}
</style>
