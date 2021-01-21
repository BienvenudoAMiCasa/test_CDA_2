// Constructeur de l'Object Repas
function Repas(type, uniJs)
{
    this.type = type;
    this.uniJs = uniJs;
}

// Création et initialisation des 3 choix de repas
var repasSushi = new Repas("sushi", "\u{1F363}");
var repasPizza = new Repas("pizza", "\u{1F355}");
var repasBroccoli = new Repas("broccoli", "\u{1F966}");

// Constructeur de l'Object RepasJour
function RepasJour(repasMidi, repasSoir)
{
    this.repasMidi = repasMidi;
    this.repasSoir = repasSoir;

    this.affichage = function ()
    {
        var repasJour;
        var repasMidi = "Repas du midi " + this.repasMidi.uniJs + "<br>";
        var repasSoir = "Repas du soir " + this.repasSoir.uniJs + "<br>";
        var repasJour = repasMidi + repasSoir;
        return repasJour;
    }
}

// Fonction ramenant le tableau des types de repas au choix
function getTypesRepas()
{
    return [repasSushi, repasPizza, repasBroccoli];
}

// Fonction ramenant la chaîne de caractères des repas de la première semaine
function getRepasSemaine()
{
    var listeRepasSemaineHtm = document.getElementById('txtRepasSemaine');
    var listeRepasSemaine = "" + listeRepasSemaineHtm.value;
    return listeRepasSemaine;
}

// Fonction ajoutant un repas en fin du choix de la première semaine à la suite d'un click sur un des boutons de choix
function ajoutRepas(type)
{
    var listeRepasSemaineHtm = document.getElementById('txtRepasSemaine');
    var listeRepasSemaine = getRepasSemaine();
    
    var typesRepas = getTypesRepas();
        
    switch (type)
    {
        case typesRepas[0].type:
            listeRepasSemaine += typesRepas[0].uniJs;
            break;
        case typesRepas[1].type:
            listeRepasSemaine += typesRepas[1].uniJs;
            break;
        case typesRepas[2].type:
            listeRepasSemaine += typesRepas[2].uniJs;
            break;
    }
    listeRepasSemaineHtm.value = listeRepasSemaine;
}

// Fonction transformant la chaîne de caractère des repas de la semaine en tableau de repas
function getLigne1TriangleMiam(listeRepasSemaine)
{
    //Initialisation du tableau de la première ligne du Triangle du miam
    var ligneRepas = [];
    // Récupération de tous les types de repas
    var typesRepas = getTypesRepas();
    // Boucle pour récupérer les repas choisis pour la première semaine et les ajouter au tableau de repas
    var repas = "";
    for (var i=0; i < 14; i++)
    {
        repas = listeRepasSemaine.substr(2*i,2);
        switch(repas)
        {
            case typesRepas[0].uniJs:
                ligneRepas.push(typesRepas[0]);
                break;
            case typesRepas[1].uniJs:
                ligneRepas.push(typesRepas[1]);
                break;
            case typesRepas[2].uniJs:
                ligneRepas.push(typesRepas[2]);
                break;
        }
    }
    return ligneRepas;
}

// Fonction ramenant le nouveau repas par prédiction de 2 précédents
function getPredictMeal(meal1,  meal2)
{
    var newMeal;
    var typesRepas = getTypesRepas();

    var iof1;
    var iof2;

    // Fonction outil de test pour la méthode findIndex()
    function checkMeal1(meal)
    {
        return meal.uniJs == meal1.uniJs;
    }

    // Fonction outil de test pour la méthode findIndex()
    function checkMeal2(meal)
    {
        return meal.uniJs == meal2.uniJs;
    }

    if(meal1.uniJs == meal2.uniJs)
    {
        newMeal = meal1; // le repas prédit est le même repas
    }
    else
    {
        iof1 = typesRepas.findIndex(checkMeal1);
        typesRepas.splice(iof1, 1);
        
        iof2 = typesRepas.findIndex(checkMeal2);
        typesRepas.splice(iof2, 1);

        newMeal = typesRepas[0]; // le repas prédit est le repas restant
    }

    return newMeal;
}

// Fonction ramenant la nouvelle ligne par prédiction de la précédente
function predictNextLine(baseLine)
{
    //parcours du tableau
    var newMeal;
    var nextLine = [];

    for (var i=0; i < baseLine.length - 1; i++)
    {
        newMeal = getPredictMeal(baseLine[i], baseLine[i+1]);
        nextLine.push(newMeal);
    }
    return nextLine;
}

// Fonction construisant le triangle Miam
// à partir de la première semaine, Déduction du triangle du miam grâce au système de prédictions.
// Renvoi le triangle Miam (tableau des 105 repas)
function buildMiamTriangle()
{
    var triangleMiam = [];

    // Commencer par récupérer les repas de cette première semaine (string des 14 repas)
    var listeRepasSemaine = getRepasSemaine();
    // Récupérer la première ligne du Triangle du miam (tableau de repas)
    var ligne1TriangleMiam = getLigne1TriangleMiam(listeRepasSemaine);

    // Ajouter cette première ligne au triangle Miam
    var repas;
    for (repas of ligne1TriangleMiam)
    {
        triangleMiam.push(repas);
    }

    // Prédire la ligne suivante à partir de la précédente
    
    // Initialiser à partir de la première ligne
    var lastLine = ligne1TriangleMiam;
    var nextLine;
    
    // Boucle pour créer toutes les lignes, chacune en fonction de la précédente
    // et ce, tant que la ligne contient au moins 2 repas
    while (lastLine.length >= 2)
    {
        nextLine = predictNextLine(lastLine);
        
        // Ajouter cette nouvelle ligne au triangle Miam
        for (repas of nextLine)
        {
            triangleMiam.push(repas);
        }

        lastLine = nextLine;
    }

    return triangleMiam;
}

// Fonction construisant le tableau de RepasJour à partir du triangle du miam.
// Renvoi le tableau de RepasJour (des 52 jours ! Le 53ème et dernier jour, le repas du soir est imprévisible)
function buildTabRepasJour()
{
    // Récupération du triangle du Miam
    var triangleMiam = buildMiamTriangle();
    
    // Récupération du tableau de repas par jour
    var listeRepasJour = [];
    // Transformer le tableau de repas triangleMiam en tableau de RepasJour
    for (var i=0; i < triangleMiam.length - 1 / 2; i++)
    {
        listeRepasJour.push(new RepasJour(triangleMiam[2*i], triangleMiam[2*i+1]));
    }
    return listeRepasJour;
}

// Fonction récupérant le numero de jour demandé depuis Html
// Renvoi le numero de jour demandé
function getNumJour()
{
    var numJourHtm = document.getElementById('numJour');
    var numJour = numJourHtm.value;
    return numJour;
}

// Fonction de récupération du menu du jour choisi
// Renvoi une chaîne de caractère du menu du jour choisi
function getMenusJour(listeRepasJour, numJour)
{
    var menusJour = "";
    var enonce = "Repas à J+" + numJour + " :<br>";
    var solution = listeRepasJour[numJour - 1].affichage();

    menusJour += enonce;
    menusJour += solution;

    return menusJour;
}

// Fonction vérifiant la validation des 2 champs du formulaire
function validationOK()
{
    var valid = false;
    var isValid_txtRepasSemaine = document.getElementById('txtRepasSemaine').validity.valid;
    var isValid_numJour = document.getElementById('numJour').validity.valid;

    valid = isValid_txtRepasSemaine && isValid_numJour;

    return valid;
}

// Fonction ajoutant le texte (pouvant contenir de l'Html) à ajouter à l'élément ayant l'id passé en entrée
function majAffichage(idHTMLElement, texttoAdd)
{
    document.getElementById(idHTMLElement).innerHTML = texttoAdd;
}

// Fonction affichant les 2 repas du jour choisi
function afficherRepas()
{
    if (validationOK())
    {
        // Récupération du tableau de RepasJour
        var listeRepasJour = buildTabRepasJour();
        
        // Récupération du numero de jour demandé
        var numJour = getNumJour();

        // Récupération du menu du jour choisi (sous forme de chaîne de caractère contenant du HTML)
        var menusJour = getMenusJour(listeRepasJour, numJour);

        // Mise à jour de l'affichage
        majAffichage("menusJour", menusJour);
    }
}

// Création du pattern servant à la validation depuis le modèle
function createPatternChoixRepas()
{
    var typesRepas = getTypesRepas();
    var patternChoixRepas = "['" + typesRepas[0].uniJs + "'|'" + typesRepas[1].uniJs + "'|'" + typesRepas[2].uniJs + "']{14}";
    return patternChoixRepas;
}

// initialisation de certaines propriétés HTML via le modèle afin de compartimenter pour faciliter maintenance, évolutivité
function init()
{
    document.getElementById("btnSushi").value = repasSushi.uniJs;
    document.getElementById("btnPizza").value = repasPizza.uniJs;
    document.getElementById("btnBroccoli").value = repasBroccoli.uniJs;

    document.getElementById("txtRepasSemaine").pattern = createPatternChoixRepas();
    
}

// Si le navigateur est moderne (supporte le DOM), la page est initialisée après le chargement complet
if (document.getElementById && document.createTextNode)
{
    window.onload = init;
}