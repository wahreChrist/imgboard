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
    mounted: function () {
        fetch("/images.json")
            .then((response) => response.json())
            .then(({ rows }) => {
                this.images = rows;
                this.lastId = this.images[this.images.length - 1].id;
            })
            .catch((err) => console.log(err));
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
            console.log(e.target.getAttribute("id")); // returns image id
            this.show = e.target.getAttribute("id");
        },
        toggle: function () {
            this.show = 0;
        },
        morePics: function () {
            fetch(`/moreImages/${this.lastId}`)
                .then((response) => response.json())
                .then((data) => {
                    // this.lastId = this.images[this.images.length - 1].id;

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
    },
    components: {
        Component1,
    },
});
app.mount("#main");
