
// Si des données sont stockées dans le local storage, on parse les données, sinon on crée les tableaux vides
var data = (localStorage.getItem('todoList')) ? JSON.parse(localStorage.getItem('todoList')) : {
	todo: [],
	completed: []
}


var removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';

var completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';

renderTodoList();


/*
 *********************************
	AJOUTER UNE TACHE
 *********************************
 */

document.getElementById('add').addEventListener('click', function(){
	
	var value = document.getElementById('item').value;

	if(value){
		
		addItem(value);
	}

});

// Pour valider avec la touche entrée
document.getElementById('item').addEventListener('keydown', function(e){
	var value = this.value;
	if(e.code === 'Enter' && value){
		addItem(value);
	}
});


function addItem(value){
	
	addItemToDOM(value);

	// On réinitialise value pour ne pas sauver dans l'input la précédente valeur
	document.getElementById('item').value = '';

	// On enregistre les données dans l'array todo
	data.todo.push(value);

	// On sauvegarde dans la base de données
	dataObjectUpdated();
}


function addItemToDOM(text, completed){

	// On attrape la ul avec la class todo ou la ul avec la class completed
	var list = (completed) ? document.getElementById('completed') : document.getElementById('todo');

	// On crée la li et on insère le contenu de la tache
	var item = document.createElement('li');
	item.innerText = text;

	// On crée la div avec la class buttons
	var buttons = document.createElement('div');
	buttons.classList.add('buttons');


	// On crée le btn remove avec la classe button et on insère l'image SVG
	var remove = document.createElement('button');
	remove.classList.add('remove');
	remove.innerHTML = removeSVG;

	// Si on clique sur le bouton remove, on déclenche l'action liée
	remove.addEventListener('click', removeItem);


	// On crée le btn complete avec la classe button et on insère l'image SVG
	var complete = document.createElement('button');
	complete.classList.add('complete');
	complete.innerHTML = completeSVG;

	// Si on clique le bouton complete, on déclenche l'aciton liée
	complete.addEventListener('click', completeItem);


	// On insère dans la div buttons le btn remove et le btn complete
	buttons.appendChild(remove);
	buttons.appendChild(complete);

	// On insère dans la li la div buttons
	item.appendChild(buttons);

	// On insère dans la ul : le li créé en première position (avant les autres taches créées)
	list.insertBefore(item, list.childNodes[0]);

}


/*
 *********************************
	SUPPRIMER UNE TACHE
 *********************************
 */

function removeItem(){
	// On cible le parent du btn (la div button) puis le parent encore pour attraper la li
	var li = this.parentNode.parentNode;

	// On cible la ul au dessus
	var ulParent = li.parentNode;

	// On récupère l'id du parent pour savoir si on est dans todo ou completed
	var id = ulParent.id;

	// On récupère le contenu de la li
	var value = li.innerText;

	if(id === 'todo'){

		// On enlève le contenu de la value dans l'array todo
		data.todo.splice(data.todo.indexOf(value), 1);

	}else{

		// On enlève le contenu de la value dans l'array completed
		data.completed.splice(data.completed.indexOf(value), 1);

	}

	// On sauvegarde dans la base de données
	dataObjectUpdated();

	// On supprime la li du ul
	ulParent.removeChild(li);

}


/*
 *********************************
	COMPLETER UNE TACHE
 *********************************
 */

function completeItem(){
	// On cible le parent du btn (la div button) puis le parent encore pour attraper la li
	var li = this.parentNode.parentNode;

	// On cible la ul au dessus
	var ul = li.parentNode;

	// On vérifie l'id de cette ul pour savoir si on est dans l'ul todo ou l'ul completed
	var id = ul.id

	// Contenu de la li
	var value = li.innerText;
	
	

	var target;

	if(id === 'todo'){

		// On enlève le contenu de la value dans l'array todo
		data.todo.splice(data.todo.indexOf(value), 1);

		// et on l'ajoute dans l'array completed
		data.completed.push(value);

		// C'est une tache à mettre dans completed
		target = document.getElementById('completed');

		target.insertBefore(li, target.childNodes[0]);

	}else{

		// On enlève le contenu de la value dans l'array completed
		data.completed.splice(data.completed.indexOf(value), 1);

		// et on l'ajoute dans l'array todo
		data.todo.push(value);

		// C'est une tache à remettre dans les todo
		target = document.getElementById('todo');

		target.insertBefore(li, target.childNodes[0]);
	}

	// On sauvegarde dans la base de données
	dataObjectUpdated();


}

/*
 *********************************
	SAUVEGARDER DANS LA BASE
 *********************************
 */

function dataObjectUpdated(){
	// On ne peut pas sauvegarder dans le local Storage un object (data). Il faut le convertir avant avec JSON Stringyfy.
	localStorage.setItem('todoList', JSON.stringify(data));
}


/*
 *********************************
	DISTRIBUER LES DONNEES DE LA BASE
 *********************************
 */

function renderTodoList(){
	// Si aucune donnée n'est présente dans la base, on ne fait rien
	if(!data.todo.length && !data.completed.length) return;

	for(var i = 0; i < data.todo.length; i++){
		var value = data.todo[i];
		addItemToDOM(value);
	}

	for(var j=0; j < data.completed.length; j++){
		var value = data.completed[j];
		addItemToDOM(value, true);
	}

}
