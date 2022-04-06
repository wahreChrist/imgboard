import * as Vue from "./vue.js";
import Component1 from "./component1.js";

const app = Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "Anonymous",
            file: null,
            show: 0,

            lastId: null,
            btn: true,
            form: false,
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
                    this.title = "";
                    this.username = "Anonymous";
                    this.description = "";
                })
                .catch((err) => console.log("error in /upload", err));
        },
        display: function (e) {
            if (this.show == e.target.getAttribute("id")) {
                console.log(this.show);
                // history.pushState({}, "", "/");
            } else if (e.target.getAttribute("id")) {
                this.show = e.target.getAttribute("id");
            }
        },
        turn: function (image) {
            image.isActive = !image.isActive;
            if (image.isActive == false) {
                this.show = 0;
            }
        },
        morePics: function () {
            fetch(`/moreImages/${this.lastId}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log("more pics obj", data);
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
        this.getImages();
    },
    components: {
        Component1,
    },
});
app.mount("#main");
