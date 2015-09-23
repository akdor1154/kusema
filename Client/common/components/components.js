
import kusema from 'kusema';
export default System.import('kusema').then( function(kusema) {
	kusema.addModule('kusema.components', [], false);

	console.log('components module made');
	return Promise.all([
		'./ContentCard/contentCard.js',
		'./EditContentForm/editContentForm.js',
		'./InlineDate/inlineDate.js',
		'./InlineGroup/inlineGroup.js',
		'./Markdown/markdown.js',
		'./QuestionPreview/questionPreview.js',
		'./ServerMessage/serverMessage.js',
		'./UserControlPanel/userControlPanel.js',
		'./UserMenu/userMenu.js'
	].map( (name) => System.import('common/components/'+name)) );


}).then(function () {
	console.log('components imported');
})