/**
 * Create manifest objects used for BPs & RPs
 */
import uuidv4 from 'uuid/v4'
import ProjectConfig from '../Project/Config'
import path from 'path'
import { APP_VERSION } from '../constants'

interface Module {
	type: string
	uuid: string
	version: [number, number, number],
	entry?: string,
	language?: string
}
interface Header {
	name: string
	description: string
	uuid: string
	version: [number, number, number]
	min_engine_version?: [number, number, number]
}
interface Dependency {
	version: [number, number, number]
	uuid: string
}
interface Metadata {
	generated_with: {
		[tool: string]: string[]
	}
	author?: string
}

export default class Manifest {
	format_version = 2
	header: Header
	modules: Module[]
	dependencies: Dependency[]
	metadata: Metadata

	constructor(
		type: 'resources' | 'data',
		client_data?: boolean,
		dependency?: Dependency,
		targetProjectVersion?: string,
		scripting?: boolean
	) {
		if (type === 'resources') {
			this.header = {
				name: 'pack.name',
				description: 'pack.description',
				uuid: uuidv4(),
				version: [1, 0, 0],
				min_engine_version: [1, 13, 0],
			}
		} else {
			this.header = {
				name: 'pack.name',
				description: 'pack.description',
				uuid: uuidv4(),
				version: [1, 0, 0],
				min_engine_version: <[number, number, number]>(
					targetProjectVersion.split('.').map(n => Number(n))
				),
			}
		}
		this.modules = [
			{
				type,
				uuid: uuidv4(),
				version: [1, 0, 0],
			},
		]

		if (scripting) this.addScripting()

		if (client_data) this.addClientData()

		if (dependency !== undefined) {
			this.dependencies = [dependency]
		}

		const appVersion = APP_VERSION.replace('v', '')
		this.metadata = {
			generated_with: {
				bridge: [appVersion],
			},
		}
	}


	addScripting() {
		Manifest.addScripting(this)
	}

	static addScripting(manifest: Manifest) {
		manifest.modules.push({
			type: 'script',
			uuid: uuidv4(),
			version: [1,0,0],
			language: 'javascript',
			entry: "scripts/index.js"
		})
	}

	addClientData() {
		Manifest.addClientData(this)
	}
	removeClientData() {
		Manifest.removeClientData(this)
	}
	static removeClientData(manifest: Manifest) {
		manifest.modules = manifest.modules.filter(
			({ type }) => type !== 'client_data'
		)
	}
	static addClientData(manifest: Manifest) {
		manifest.modules.push({
			type: 'client_data',
			uuid: uuidv4(),
			version: [1, 0, 0],
		})
	}
	static hasClientData(manifest: Manifest) {
		for (let { type } of manifest.modules) {
			if (type === 'client_data') return true
		}
		return false
	}

	static getPackFolder(file_path: string) {
		let folders = path.dirname(file_path).split(path.sep)
		return folders[folders.length - 2]
	}

	get uuid() {
		return this.header.uuid
	}

	get() {
		return JSON.stringify(this, null, '\t')
	}
}
