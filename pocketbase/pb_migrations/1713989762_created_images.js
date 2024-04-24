/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "wqoeh8dbufn1t6g",
    "created": "2024-04-24 20:16:02.592Z",
    "updated": "2024-04-24 20:16:02.592Z",
    "name": "images",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "9gut21gw",
        "name": "image",
        "type": "file",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "mimeTypes": [
            "image/png",
            "image/jpeg",
            "image/gif",
            "image/webp",
            "image/svg+xml",
            "image/jxr",
            "image/avif",
            "image/x-gimp-gbr",
            "image/x-gimp-pat",
            "image/x-xcf",
            "image/vnd.radiance",
            "image/heif-sequence",
            "image/heif",
            "image/heic-sequence",
            "image/heic",
            "image/vnd.dwg",
            "image/x-icns",
            "image/jxs",
            "image/jpm",
            "image/jxl",
            "image/jpx",
            "image/jp2",
            "image/vnd.mozilla.apng",
            "image/vnd.adobe.photoshop",
            "image/x-xpixmap",
            "image/tiff",
            "image/bmp",
            "image/x-icon",
            "image/vnd.djvu",
            "image/bpg"
          ],
          "thumbs": [],
          "maxSelect": 1,
          "maxSize": 5242880,
          "protected": false
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("wqoeh8dbufn1t6g");

  return dao.deleteCollection(collection);
})
