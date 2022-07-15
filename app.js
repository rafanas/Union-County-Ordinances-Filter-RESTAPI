//Ordinance Taxonomies End-points
let urls = [
    "https://www.staging8.unioncountyil.gov/wp-json/wp/v2/ordinance_chapters?per_page=100&page=1",
    "https://www.staging8.unioncountyil.gov/wp-json/wp/v2/ordinance_chapters?per_page=100&page=2"
];

//UI Fields to Populate
let formItem = document.getElementById("ordinancesCollection");
let resultList = document.getElementById("ordinance-list");

//Current Taxonomy Selection ID
let currentSelection = null;

//Populate Select Options When Data is Available
function getTaxonomies(data) {
    data.forEach((each) => {
        formItem.innerHTML = formItem.innerHTML +
            `<option value="${each.name}" id="${each.id}"> ${each.name} </option>`;
    });
}

//Listen to Selection Field Changes
formItem.addEventListener("change", (event) => {
    currentSelection = event.target.selectedOptions[0].id;
    resultList.textContent = "";
    getOrdinances();
});

//Fetch Taxonomy End-points & Merge Data for Select Field
let requests = urls.map((url) => fetch(url));
Promise.all(requests)
    .then((responses) => Promise.all(responses.map((r) => r.json())))
    .then((data) => getTaxonomies(data.flat()));

//Fetch Ordinances from Taxonomy Selection ID
function getOrdinances() {
    let url = "https://www.staging8.unioncountyil.gov/wp-json/wp/v2/old-ordinances?ordinance_chapters=" + currentSelection;
    fetch(url)
        .then((response) => response.json())
        .then((data) => data.forEach((each) => {

            //Generate Container for Each Result
            let eachResult = document.createElement("div");

            //Generate Content Container for Each Result
            let rTitle = document.createElement("h2");
            let rDescription = document.createElement("p")

            //Populate Content for Each Result
            let resultItemTitle = each.title.rendered.replace(/&#8211;/g, '&ndash;');
            let resultItemDesc = each["wpcf-article-description"];

            //Populate Content Containers for Each Result
            rTitle.innerHTML = resultItemTitle;
            rDescription.innerHTML = resultItemDesc;

            //Append Content to Each Result
            eachResult.appendChild(rTitle);
            eachResult.appendChild(rDescription);

            //Add Result to DOM
            resultList.appendChild(eachResult);
        }));
}