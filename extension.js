// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "plantuml-master" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('plantuml-master.deleteEntity', function () {
		// The code you place here will be executed every time your command is executed
		// 判断当前行是否是entity，entity的定义为`.*" as (\w+)`，如果是则删除当前行，同时根据匹配到的实体名称删除相关的行，否则提示不是entity
		// 获取当前行的内容
		let editor = vscode.window.activeTextEditor;
		let document = editor.document;
		let selection = editor.selection;
		let line = document.lineAt(selection.start.line);
		let lineText = line.text;
		// 判断当前行是否是entity
		let entityReg = /.*" as (\w+)/;
		let entityMatch = lineText.match(entityReg);
		if (entityMatch) {
			// 获取当前行的entity名称
			let entityName = entityMatch[1];
			// 删除当前行
			editor.edit(editBuilder => {
				// 删除相关的行
				let lineCount = document.lineCount;
				for (let i = lineCount - 1; i > -1; i--) {
					let line = document.lineAt(i);
					let lineText = line.text;

					let entityMatch = lineText.trim().indexOf(entityName);
					if (entityMatch > -1) {
						// vscode.window.showInformationMessage(`${entityName} -> ${lineText} -> ${entityMatch}`);
						// tell line position
						// vscode.window.showInformationMessage(`line ${line.range.start.line} start ${line.range.start.character} end  ${line.range.end.line} ${line.range.end.character}`);
						editBuilder.delete(line.range);
					}
				}
				// editBuilder.delete(line.range);
				vscode.window.showInformationMessage(`delete entity ${entityName}`);

			});

			// vscode.window.showInformationMessage('delete entity success!');
		} else {
			vscode.window.showInformationMessage('current line is not an entity');
		}



	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
