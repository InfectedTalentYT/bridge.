import { TPlayerType } from '../UI/Play/state'

export interface FileDefinition {
	id?: string
	target_version?: string
	includes?: string
	file_viewer?: 'json' | 'text' | 'model'
	player?: TPlayerType
	rp_definition?: boolean
	build_array_exceptions?: string[]
	default_build_arrays?: boolean
	documentation?: string | FileDocumentation
	start_state?: string
	lightning_cache?: string
	highlighter?: string
	language?: string
	file_creator?: string | FileCreator
	problems?: string[]
	snippets?: string
	text_separators?: string[]
	comment_character?: string
}

export interface FileCreator {
	[x: string]: any
}

export interface SnippetDefinition {
	[x: string]: any
}

export interface ProblemDefinition {
	[x: string]: any
}

export interface FileDocumentation {
	base: string
	inject: string
	extend: string
}
