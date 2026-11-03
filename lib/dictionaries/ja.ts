import type { Dictionary } from "../i18n";

const ja: Dictionary = {
  brand: "FractionCalc",
  tagline: "すべての分数計算はブラウザ内で実行されます。",
  metaDesc: "無料の分数計算ツール:加減乗除、約分、分数と小数・帯分数の変換。すべてブラウザ内で動作し、入力した数値が端末の外に出ることはありません。",

  nav: {
    tools: "すべてのツール",
    categories: "カテゴリー",
    about: "このサイトについて",
    menu: "メニュー",
    language: "言語",
  },

  home: {
    heroTitle: "分数がようやくわかる——足し算、約分、変換をひとつの画面で",
    heroSub: "FractionCalc は分数計算専用のツール集です。加減算は最小公倍分母を求めて途中式まで表示、乗算はたすき掛けで約分、GCD による既約化、分数・小数・帯分数の相互変換。すべてブラウザ内で動き、速くて無料、登録も送信もありません。",
    browseAll: "すべてのツールを見る",
    pinned: "ピン留め",
    pin: "トップに固定",
    unpin: "固定を解除",
    popular: "人気のツール",
    categoriesTitle: "カテゴリー",
    featuredTitle: "人気のツール",
    trustLocal: "入力した数値は端末の中だけ",
    trustFree: "無料・アカウント不要",
    trustFast: "即時処理・オフライン対応",
    rotating: [
      "1/2 + 1/3 = 5/6——通分の過程を一歩ずつ表示",
      "8/12 → 2/3:GCD で最後まで約分",
      "0.333 → 1/3:小数を分数へ戻し、循環桁も明示",
      "2 1/3 ↔ 7/3:帯分数と仮分数を双方向に変換",
    ],
    statsLabels: { tools: "ツール", languages: "言語", uploads: "アップロード", accounts: "アカウント" },
    eyebrow: "ずっと無料",
    heroCtaSecondary: "仕組みを見る",
    statsTools: "{n} 個のツール",
    statsLanguages: "{n} 言語",
    statsUploads: "アップロード 0 回",
    statsAccounts: "アカウント 0 個",
    categoriesSub: "すべての演算をカバーする分数計算ツール。端末の中で動きます。",
    popularSub: "いちばん使われているツール。",
    privacyTitle: "入力した数値が端末の外に出ることはありません。",
    privacySub: "アップロードという工程が存在しません。ツールはブラウザ内で動く JavaScript そのものです。ポリシーではなく構造の話です。",
    privacyPoint1T: "ローカル処理",
    privacyPoint1D: "入力した分数と数値は、打ち込みながらメモリ内で処理されます。何も送信しません。",
    privacyPoint2T: "アカウント不要",
    privacyPoint2D: "登録もメールも履歴もありません。開いてすぐ使えます。",
    privacyPoint3T: "誠実な設計",
    privacyPoint3D: "ブラウザでできないことは、できないとはっきり書きます。",
    privacyLink: "プライバシーの詳細を読む",
    endTitle: "ツールを選んで、すぐ使える。",
    endSub: "15 言語、送信ゼロ、インストール不要。",
  },

  tools: {
    title: "すべてのツール",
    subtitle: "{count} 個の無料ブラウザツールを検索。アップロード不要・登録不要。",
    filterPlaceholder: "ツールを検索…",
    count: "{count} 個のツール",
    empty: "「{query}」に一致するツールはありません。",
  },

  categories: {
    pdf: { name: "PDF", desc: "PDF の結合・分割・変換・編集をどこにもアップロードせずに行えます。" },
    image: { name: "画像", desc: "画像の圧縮・リサイズ・切り抜き・形式変換をブラウザ内で。" },
    text: { name: "テキスト", desc: "文字数・整形・並べ替え・変換を入力しながら即時に。" },
    developer: { name: "開発者", desc: "日々の開発に使うフォーマッタ・エンコーダ・ジェネレータ。" },
    seo: { name: "SEO", desc: "メタタグ・構造化データ・SERP プレビューなどの SEO ヘルパー。" },
    security: { name: "セキュリティ", desc: "パスワード・ハッシュ・各種ルックアップを端末内で生成・検証。" },
    utility: { name: "分数計算", desc: "分数の加減乗除、約分、変換——正確で途中式つき、すべてブラウザで。" },
  },

  tool: {
    howTo: "使い方",
    faq: "よくある質問",
    related: "関連ツール",
    nextStep: "次のステップ",
    copyLink: "リンクをコピー",
    privacyNote:
      "このツールは完全にブラウザ内で動作します。データは端末から出ず、サーバーへアップロードされることはありません。",
    inCategory: "{category}のその他のツール",
    backToCategory: "{category}のすべてのツール",
  },

  common: {
    openTool: "ツールを開く",
    copy: "コピー",
    copied: "コピーしました",
    download: "ダウンロード",
    reset: "リセット",
    swap: "入れ替え",
    clear: "クリア",
    error: "エラーが発生しました。入力を確認して再試行してください。",
    input: "入力",
    output: "結果",
    settings: "オプション",
    dropFiles: "ここにファイルをドロップ、またはクリックして選択",
    dropFile: "ここにファイルをドロップ、またはクリックして選択",
    processing: "処理中…",
    fileSize: "サイズ",
    sample: "サンプルを試す",
    uppercase: "大文字",
  },

  unit: {
    from: "変換前",
    to: "変換後",
    amount: "数値",
    result: "結果",
    common: "よく使う変換",
    formula: "計算式",
    allUnits: "すべての単位",
  },

  text: {
    stats: {
      words: "単語数",
      characters: "文字数",
      charsNoSpaces: "空白除く",
      sentences: "文の数",
      paragraphs: "段落",
      lines: "行数",
      readingTime: "読了時間",
      readingMinutes: "約 {n} 分",
    },
  },

  footer: {
    line: "分数計算ツール。入力したものが端末の外に出ることはありません。",
    privacy: "プライバシー",
    terms: "利用規約",
    about: "このサイトについて",
    badges: "バッジ",
    language: "言語",
  },

  badge: {
    title: "FractionCalc バッジ",
    desc: "サイトや README、ドキュメントに FractionCalc バッジを貼りましょう。ここへリンクし、背後の分数ツールが完全にブラウザ内で動いていることを伝えます。",
    voluntary: "設置は完全に任意です。プロジェクトを気に入ったらお好きなバッジをどうぞ。許可は不要です。",
    md: "Markdown(README)",
    html: "HTML(ウェブサイト)",
    thanks: "広めていただきありがとうございます。すべての設置が、ファイルを尊重するツールの発見につながります。",
  },

    embed: {
    title: "ツールを埋め込む",
    desc: "1 行であなたのサイトにツールを。訪問者のブラウザ内で動きます。",
  },

    mcp: {
    title: "MCP サーバー——AI から呼び出せるツール",
    desc1: "FractionCalc は MCP(Model Context Protocol)サーバーを同梱しています。Claude や Cursor などの AI アシスタントが、このサイトで見られるのと同じ分数計算をそのまま実行できます。テスト済みの同一ロジックで、再実装は不要です。",
    desc2: "ツールはサイト自体の純関数——分数の四則、約分、分数と小数の相互変換——を実行します。実行は npx 経由で AI クライアント側のマシン上で行われ、当社サーバーには何も送られません。",
    toolsTitle: "実行可能なツール({n} 個)",
    requiresNode: "Node.js 18+ が必要です。サーバーは stdio でローカル実行。呼び出したツール計算のみローカルで行われます。",
    privacy: "Node.js 18+ が必要です。サーバーは stdio でローカル実行。呼び出したツール計算のみローカルで行われます。",
  },

    notFound: {
    title: "ページが見つかりません",
    body: "お探しのツールは存在しません。すべてのツールからお探しください。",
    home: "ホームへ戻る",
  },
};

export default ja;
