let simplemde;
let blogMsg = new Vue({
    el: "#blog_message",
    data: {
        postOrput: 0,
        tag: [],
        BGcnt: [0],
        BGcolor: ['#d4d4d4', 'antiquewhite'],
        article: {
            id: -1,
            title: "",
            ellipsisContent: "",
            content: "",
            tagId: ""
        }
    },
    mounted: function () {
        $.get(rootsrc + "api/tag",
            function (tagData) {
                blogMsg.tag = tagData;
            }
        );
        this.postOrput = -1;
        if (document.getElementById('blogID').value != "") {
            this.postOrput = 1;
            $.ajax({
                type: "get",
                url: rootsrc + "api/tag/" + document.getElementById('blogID').value,
                success: function (tags) {
                    $.each(blogMsg.tag, function (idx, value) {
                        if (tags.includes(value.name))
                            Vue.set(blogMsg.BGcnt, value.id, 1);
                    });
                }
            });

            let filter = {
                id: $('#blogID')[0].value,
                needReturn: "111100"
            };
            $.ajax({
                url: rootsrc + 'api/blog',
                type: "get",
                contentType: "application/json",
                dataType: "json",
                data: {
                    jsonFilter: JSON.stringify(filter)
                },
                success: function (blogData) {
                    blogMsg.article = blogData[0];
                    simplemde = simplemde.value(blogData[0].content);
                    loadEl();
                }
            });
        } else loadEl();
    },
    methods: {
        reverseBG: function (value) {
            var bgCount = blogMsg.BGcnt[value];
            if (bgCount === undefined) bgCount = 0;
            bgCount = (bgCount + 1) % 2;
            $('[value=' + value + ']').css('background-color', blogMsg.BGcolor[bgCount]);
            Vue.set(blogMsg.BGcnt, value, bgCount);
        },
        rquestToServer: function (method, returnUrl) {
            if (blogMsg.article.tagId === undefined) blogMsg.article.tagId = "";
            for (let i = 0; i < blogMsg.BGcnt.length; i++) {
                if (blogMsg.BGcnt[i]) blogMsg.article.tagId += i + ';';
            }
            blogMsg.article.content = simplemde.value();
            $.ajax({
                url: rootsrc + 'api/blog',
                type: method,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(blogMsg.article),
                success: function (msg) {
                    window.location.href = returnUrl;
                }
            });
        },
        uploadForm: function () {
            blogMsg.rquestToServer("post", rootsrc + "home/index");
        },
        updateForm: function () {
            blogMsg.rquestToServer("put", rootsrc + "home/blogdetail?id=" + blogMsg.article.id);
        }
    },
});

window.onload = function () {
    get_time();
    simplemde = new SimpleMDE({
        element: document.getElementById("mdtest"),
        autoDownloadFontAwesome: false,
        spellChecker: false,
        status: ["lines", "words"],
        tabSize: 4
    });
    $(".editor-preview-side").addClass("markdown-body");
}