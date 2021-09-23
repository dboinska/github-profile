import * as v from "./variables.js";

const hide = document.querySelector(".hide");
const searchAlert = document.querySelector(".search-alert");
let pAlert = document.createElement("p");
//let userData = document.createElement("div");

//Get Users
export async function getUser(username) {
  const response = await fetch(v.APIURL + username);
  const data = await response.json();
  // console.log(data);

  if (!response.ok) {
    errorMessage("User not found, try another");
  } else {
    displayData(data);
    getRepos(username);
  }
}

// Get Repos
async function getRepos(username) {
  const response = await fetch(v.APIURL + username + "/repos");
  const data = await response.json();
  searchAlert.classList.add("d-none");
  console.log(data);
  displayRepos(data);
}

// Error message function
export function errorMessage(msg) {
  searchAlert.classList.add("d-none");
  v.profile.textContent = "";
  hide.classList.remove("d-block").add("d-none");
  //document.querySelector(".hide").style.display = "none";
  if (pAlert) {
    pAlert.classList.remove("container", "alert", "alert-danger");
  }
  pAlert.textContent = `${msg}`;
  pAlert.classList.add("container", "alert", "alert-danger");
  document.body.appendChild(pAlert);
  return pAlert;
  //return (v.repos.innerHTML = `<p class="alert alert-danger">${msg}</p>`);
}

function displayData(user) {
  pAlert.classList.add("d-none");
  const html = `
    <img
      src="${user.avatar_url}"                 
      alt="${user.name}"
      class="img-thumbnail rounded-circle"
    />
    </div>

            <h2>${user.name}</h2>
            <p>${user.login}</p>
            <div class="d-grid">
              <a href="https://github.com/${user.login}"target="_blank" rel="noopener" class="btn btn-outline-secondary">View Profile</a>
            </div>
            <p class="pt-">
              <span>${user.followers} Followers</span>
              <span>${user.following} Following</span>
            </p>
            <p>${user.public_repos} Public Repositories</p>
            <p><i class="fas fa-map-marker-alt"></i>${user.location}</p>
            `;
  v.profile.innerHTML = html;
}

//Display Repos
function displayRepos(repoData) {
  let repo_data = repoData.map((repo) => {
    return `<span class="repo border border-rounded p3">
    <a href="${repo.html_url}" target="blank" rel="noopener">${repo.name}</a>
    <p class="bold">Stars: ${repo.starazers_count} | Watchers: ${repo.watchers_count} | Forks: ${repo.forks_count}</p>
  </span>`;
  });
  //v.repos.innerHTML = repo_data;
  v.repos.innerHTML = repo_data.slice(0, 8).join("");
  hide.classList.remove("d-none");
  hide.classList.add("d-block");
}
