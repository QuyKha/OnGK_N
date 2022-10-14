const express = require("express");
const app = express();
const multer = require("multer");
const load = multer();

app.use(express.static("./templates"));
app.set("view engine", "ejs");
app.set("views", "./templates");

const AWS = require("aws-sdk");

const config = new AWS.Config({
    accessKeyId: "AKIAXOZL4NJ324FPX3XE",
    secretAccessKey: "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",
    region: "ap-southeast-1"
});

AWS.config = config;

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "Tuyen_Du_Lich";

app.get("/", (req, res) => {
    const params = {
        TableName: tableName
    }
    docClient.scan(params, (err, data) => {
        if (err)
            console.log(err);
        else
            return res.render("table", { data: data.Items });
    });
});

app.post("/delete", load.fields([]), (req, res) => {
    const { maTour } = req.body;

    const params = {
        TableName: tableName,
        Key: {
            "maTour": maTour
        }
    }

    docClient.delete(params, (err, data) => {
        if (err)
            console.log(err);
        else
            return res.redirect("/");
    })
});

app.post("/", load.fields([]), (req, res) => {
    const { tenTour, theLoai, thoiGian, gia, ghiChu } = req.body;
    var cnt = 1;
    const params_2 = {
        TableName: tableName
    }
    docClient.scan(params_2, (err, data) => {
        if (err)
            console.log(err);
        else {
            data.Items.forEach((o) => {
                if (Number(o.maTour) > cnt)
                    cnt = (Number(o.maTour) * 1) + 1;
            });
            const params = {
                TableName: tableName,
                Item: {
                    "maTour": String(cnt),
                    "tenTour": tenTour,
                    "theLoai": theLoai,
                    "thoiGian": thoiGian,
                    "gia": Number(gia),
                    "ghiChu": ghiChu
                }
            }
            docClient.put(params, (err, data) => {
                if (err)
                    console.log(err);
                else
                    return res.redirect("/");
            })
        }
    });
});

app.get("/form-add", (req, res) => {
    return res.render("form", { err: "" });
});

app.listen(3000, () => {
    console.log("running port 3000");
})