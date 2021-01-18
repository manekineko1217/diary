'use strict';

// モジュール
import * as handleFile from './modules/handle-files.js';
import * as errorHandler from './modules/error-handler.js';
import { removeAllChildren, listStyle, search, sanitize } from './modules/util.js';

// ツールバー
const tools = document.getElementsByClassName('tool'),
    createButton = document.getElementById('create-button'),
    saveButton = document.getElementById('save-button'),
    deleteButton = document.getElementById('delete-button'),
    searchButton = document.getElementById('search-button'),
    closeButton = document.getElementById('close-button'),
    infoButton = document.getElementById('info-button'),
    fileElement = document.getElementById('file-element');

// メインコンテンツ
const titleArea = document.getElementById('title-area'),
    contentArea = document.getElementById('content-area'),
    writeDate = document.getElementById('write-date'),
    saveList = document.getElementById('save-list');

// リスト内を検索する
searchButton.onclick = () => {
    const targets = saveList.getElementsByClassName('list-item');
    const keyword = prompt('検索キーワードを入力してください');
    if (keyword) {
        try {
            search(targets, keyword, 'i');
            tools[5].style.display = 'list-item';
        } catch (error) {
            errorHandler.search(error);
        }
    }
}

// 詳細情報を表示する
infoButton.onclick = () => {
    const width = 750;
    const height = 500;
    const x = (window.innerWidth / 2) - (width / 2);
    const y = (window.innerHeight / 2) - (height / 2);
    window.open(`/web-diary/information`, null, `top=${y},left=${x},width=${width},height=${height}`);
}

fileElement.addEventListener('change', handleFiles, false);

/**
 * ユーザーが選択したファイルを添付する
 * @param {Object} event Event オブジェクト
 */
function handleFiles(event) {
    const file = event.target.files[0];
    const type = file.type.split('/')[0];
    if ((1 * 1024 * 1024) <= file.size) {
        alert('1MB以下のファイルを添付できます');
        fileElement.value = null;
        return;
    }
    switch (type) {
        case 'video':
            const videoElement = handleFile.video(file);
            contentArea.appendChild(videoElement);
            break;
        case 'audio':
            const audioElement = handleFile.audio(file);
            contentArea.appendChild(audioElement);
            break;
        case 'image':
            const imageElement = handleFile.image(file);
            contentArea.appendChild(imageElement);
            break;
        case 'text':
            const textAreaElement = handleFile.text(file);
            contentArea.appendChild(textAreaElement);
            break;
        default:
            alert('未対応の形式です');
            break;
    }
    fileElement.value = null;
}

/**
 * ローカルストレージに記事を保存する
 * @param {String} key 保存するキーの名称
 */
function save(key) {
    const diary = {
        title: titleArea.value,
        content: contentArea.innerHTML,
        createdAt: new Date(parseInt(key.split('_')[1])).toLocaleString({ timeZone: 'Asia/Tokyo' }),
        updatedAt: new Date().toLocaleString({ timeZone: 'Asia/Tokyo' })
    };
    try {
        localStorage.setItem(key, JSON.stringify(diary));
    } catch (error) {
        errorHandler.storage(error);
        load(saveList.querySelector(`[data-key="${key}"]`) || saveList.firstChild);
    }
    addToList(key);
}

/**
 * 保存したデータをリストに追加する
 * @param {String} key キーの名称
 */
function addToList(key) {
    const container = document.createElement('div');
    container.className = 'container';
    const videoElement = contentArea.getElementsByTagName('video');
    const imageElement = contentArea.getElementsByTagName('img');
    const image = document.createElement('img');
    image.className = 'thumbnail';
    if (videoElement.length) {
        const video = document.createElement('video');
        video.className = 'thumbnail';
        video.loop = true;
        video.muted = true;
        video.autoplay = true;
        video.src = videoElement[0].src;
        container.appendChild(video);
    } else if (imageElement.length) {
        image.src = imageElement[0].src;
        container.appendChild(image);
    } else {
        image.src = './images/no-image.png';
        container.appendChild(image);
    }
    const title = document.createElement('h3');
    const text = document.createElement('p');
    title.className = 'list-title';
    text.className = 'list-text';
    title.innerText = titleArea.value || 'Untitled';
    text.innerText = contentArea.textContent || 'No text';
    container.appendChild(title);
    container.appendChild(text);
    titleArea.value = null;
    const existingItem = saveList.querySelector(`[data-key="${key}"]`);
    if (existingItem) {
        removeAllChildren(existingItem);
        existingItem.appendChild(container);
        load(existingItem);
    } else {
        const listItem = document.createElement('li');
        listItem.className = 'list-item';
        listItem.dataset.key = key;
        listItem.appendChild(container);
        listItem.onclick = () => load(listItem);
        saveList.insertBefore(listItem, saveList.firstChild);
        load(listItem);
    }
}

// 新規作成
createButton.addEventListener('click', create, false);

/**
 * 新しく記事を作成する
 */
function create() {
    titleArea.value = null;
    removeAllChildren(contentArea);
    removeAllChildren(writeDate);
    save(`diary_${Date.now()}`);
}

/**
 * 引数に渡されたキーを削除する
 * @param {String} key 削除するキーの名称
 */
function remove(key) {
    localStorage.removeItem(key);
    const existingElement = saveList.querySelector(`[data-key="${key}"]`);
    existingElement ? existingElement.remove() : console.warn('削除指定された要素は存在しません');
    saveList.firstChild ? load(saveList.firstChild) : create();
}

/**
 * ローカルストレージからデータを取得して表示する
 * @param {String} key 取得するキーの名称
 */
function output(key) {
    const diary = JSON.parse(localStorage.getItem(key));
    titleArea.value = diary.title;
    contentArea.innerHTML = diary.content;
    writeDate.textContent = diary.updatedAt === diary.createdAt ?
        `Created on ${diary.createdAt}` : `Created on ${diary.createdAt}, Updated on ${diary.updatedAt}`;
}

/**
 * 引数に渡された要素の情報を取得して操作する
 * @param {HTMLElement} listItem 選択した要素
 */
function load(listItem) {
    tools[5].style.display = 'none';
    listStyle(listItem, saveList.getElementsByClassName('list-item'));
    listItem.scrollIntoView({ behavior: 'smooth' });
    const key = listItem.dataset.key;
    try {
        output(key);
        saveButton.onclick = () => save(key);
        deleteButton.onclick = () => remove(key);
        closeButton.onclick = () => {
            listStyle(listItem, saveList.getElementsByClassName('list-item'));
            tools[5].style.display = 'none';
        }
    } catch (error) {
        remove(key);
        console.warn(`“${key}” のデータを取得できませんでした`, error);
    }
}

// ページ読み込み時
window.onload = () => {
    const items = new Array();
    for (let i = 0; i < localStorage.length; i++) {
        items.push(localStorage.key(i));
    }
    const keys = items
        .filter(item => /diary_\d+/.test(item))
        .sort((a, b) => parseInt(a.split('_')[1]) - parseInt(b.split('_')[1]));
    if (keys.length === 0) {
        create();
        return;
    }
    keys.forEach(key => {
        try {
            output(key);
            addToList(key);
        } catch (error) {
            remove(key);
            console.warn(`“${key}” のデータを取得できませんでした`, error);
        }
    });
    console.assert(
        keys.length === saveList.childElementCount,
        `リストの項目数が正しくありません`
    );
}
