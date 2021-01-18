'use strict';

/**
 * 指定した要素の子要素を全削除する
 * @param {HTMLElement} element 
 */
function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * リストアイテムのスタイルを設定する
 * @param {HTMLElement} selectedItem 選択したリストアイテム
 * @param {HTMLCollection} items リストアイテムの配列風オブジェクト
 */
function listStyle(selectedItem, items) {
  for (let item of items) {
    item.style.display = 'flex';
    item.style.backgroundColor = '#ffffff';
  }
  selectedItem.style.backgroundColor = '#eeeeee';
}

/**
 * 指定されたキーワードに一致したリストアイテムをリストに表示する
 * @param {HTMLCollection} targets 検索対象のリスト
 * @param {String} keyword 検索キーワード
 * @param {String} [flags] 正規表現フラグ
 */
function search(targets, keyword, flags) {
  flags = flags || 'ig';
  keyword = new RegExp(keyword, flags);
  for (let target of targets) {
    const result = keyword.test(target.textContent);
    target.style.display = result ? 'flex' : 'none';
  }
}

/**
 * 指定した文字列をエスケープして返す
 * @param {String} text エスケープする文字列
 * @return {String} エスケープされた文字列
 */
function sanitize(text) {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
    .replace(/&/g, '&amp;')
    .replace(/^javascript:/, '');
}

export { removeAllChildren, listStyle, search, sanitize };