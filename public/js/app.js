import * as Vue from "./vue.js";
import Component1 from "./component1.js";

const app = Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            show: 0,
            lastId: null,
            btn: true,
        };
    },

    methods: {
        selectFile: function (e) {
            this.file = e.target.files[0];
        },
        upload: function (e) {
            const fd = new FormData();
            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("username", this.username);
            fd.append("description", this.description);
            fetch("/upload", {
                method: "POST",
                body: fd,
            })
                .then((resp) => resp.json())
                .then((data) => {
                    this.images.unshift(data);
                })
                .catch((err) => console.log("error in /upload", err));
        },
        display: function (e) {
            this.show = e.target.getAttribute("id");
        },
        toggle: function () {
            this.show = 0;
            history.pushState({ page: "main" }, "", "/");
        },
        morePics: function () {
            fetch(`/moreImages/${this.lastId}`)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((element) => {
                        this.lastId = element.id;
                        element.lowestId === this.lastId
                            ? (this.btn = false)
                            : (this.btn = true);

                        this.images.push(element);
                    });
                })
                .catch((err) => console.log("error in more images", err));
        },
        getImages: function () {
            fetch("/images.json")
                .then((response) => response.json())
                .then(({ rows }) => {
                    this.images = rows;
                    this.lastId = this.images[this.images.length - 1].id;
                })
                .catch((err) => console.log(err));
        },
    },
    mounted: function () {
        window.addEventListener("popstate", (e) => {
            if (e.state.page == "main" || e.state.page == "nonexistant") {
                this.show = 0;
            } else {
                this.show = e.state.page;
            }
        });
        this.getImages();
        this.show = location.pathname.slice(1);
        // console.log(
        //     this.images.some(function (pic) {
        //         parseInt(pic.id) == location.pathname.slice(1);
        //     })
        // );
    },
    components: {
        Component1,
    },
});
app.mount("#main");
