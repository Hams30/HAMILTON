"use strict";

// get sidebar toggler
const sidebarToggler = document.querySelector('.sidebar-toggler')

// get sidebar
const sidebar = document.querySelector('.sidebar')

// get content
const content = document.querySelector('.content')



const toggleSidebar = () => {

    if (sidebarToggler) {

        // add click event
        sidebarToggler.addEventListener("click", () => {

            sidebar.classList.toggle("open")
            content.classList.toggle("open")

        })

    }
}


toggleSidebar()