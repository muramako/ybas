# ybas (YouTube Auto Swipe)

YouTube Shorts の視聴が終わったら、自動で次のショート動画にスワイプ(遷移)するブラウザ拡張機能です。
Windows・Mac のどちらでも、Chrome / Brave 上で動作します。

## 特徴

- YouTube Shorts の再生が終了したタイミングを検知し、自動で次の動画へ遷移
- 手動でスワイプ / クリックする手間を省き、Shorts を連続再生
- Windows / Mac のどちらの OS でも同じ挙動
- Chrome、Brave など Chromium ベースのブラウザに対応

## 対応ブラウザ

- Google Chrome
- Brave

## インストール

現在開発中です。ローカルで動作を確認する場合は以下の手順を想定しています。

1. このリポジトリをクローンする
   ```sh
   git clone <repository-url>
   cd ybas
   ```
2. Chrome または Brave で `chrome://extensions` を開く
3. 右上の「デベロッパーモード」を有効にする
4. 「パッケージ化されていない拡張機能を読み込む」からこのリポジトリのフォルダを選択する

## 使い方

1. 拡張機能を有効化した状態で YouTube Shorts ([https://www.youtube.com/shorts](https://www.youtube.com/shorts)) を開く
2. 動画を再生する
3. 再生が終わると自動的に次のショート動画へ切り替わる

## ライセンス

TBD
