import { createWindow } from '../create'
import InformationComponent from './Information/Information.vue'
import ConfigComponent from './Config/Config.vue'
import InputComponent from './Input/Input.vue'
import DropdownComponent from './Dropdown/Dropdown.vue'
import ConfirmComponent from './Confirm/Confirm.vue'
import ProjectConfig from '../../../Project/Config'

export function createInformationWindow(
	displayName: String,
	displayContent: String
) {
	const Information = createWindow(InformationComponent, {
		windowTitle: displayName,
		content: displayContent,
	})
	Information.open()
}

export function createConfigWindow(
	displayName: String,
	inputLabel: String,
	enableholidayfeatures: boolean,
	enablecustombiomes: boolean,
	enableupcomingcreatorfeatures: boolean,
	enablescripting: boolean,
	enablemolangfeatures: boolean,
	enableexperimentalcameras: boolean,
	onConfirm: (input: boolean[]) => void
) {
	const Input = createWindow(ConfigComponent, {
		windowTitle: displayName,
		label: inputLabel,
		enableholidayfeatures: enableholidayfeatures,
		enablecustombiomes: enablecustombiomes,
		enableupcomingcreatorfeatures: enableupcomingcreatorfeatures,
		enablescripting: enablescripting,
		enablemolangfeatures: enablemolangfeatures,
		enableexperimentalcameras: enableexperimentalcameras,
		onConfirmCb: onConfirm,
	})
	Input.open()
	return Input
}

export function createInputWindow(
	displayName: String,
	inputLabel: String,
	defaultValue: String,
	expandText: String,
	onConfirm: (input: string) => void
) {
	const Input = createWindow(InputComponent, {
		windowTitle: displayName,
		label: inputLabel,
		inputValue: defaultValue,
		expandText: expandText ?? '',
		onConfirmCb: onConfirm,
	})
	Input.open()
	return Input
}

export function createDropdownWindow(
	displayName: String,
	placeholder: String,
	options: Array<string>,
	defaultSelected: string,
	onConfirm: (input: string) => void
) {
	const Dropdown = createWindow(DropdownComponent, {
		windowTitle: displayName,
		placeholder,
		selectedValue: defaultSelected,
		items: options,
		onConfirmCb: onConfirm,
	})
	Dropdown.open()
	return Dropdown
}

export function createConfirmWindow(
	displayContent: String,
	confirmText: String,
	cancelText: String,
	onConfirm: () => void,
	onCancel: () => void
) {
	const Confirm = createWindow(ConfirmComponent, {
		content: displayContent,
		confirmText,
		cancelText,
		onConfirmCb: onConfirm,
		onCancelCb: onCancel,
	})
	Confirm.open()
	return Confirm
}
