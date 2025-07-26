document.addEventListener('DOMContentLoaded', () => {
    const mainNav = document.querySelector('.main-nav');
    const topHero = document.querySelector('.top-hero'); // ヒーローセクションの要素
    const heroImage = document.querySelector('.top-hero img'); // ヒーロー画像

    let navOffsetTop = 0; // ナビゲーションが固定されるスクロール位置
    let heroHeight = 0; // ヒーローセクションの高さ

    // 要素の初期位置と高さを取得する関数
    // 画像ロード後やリサイズ時に再計算されるようにする
    function updateDimensions() {
        if (mainNav && topHero) {
            // mainNavの初期位置を正確に取得
            // mainNavの上の要素（top-hero）の高さが navOffsetTop になるように設定
            navOffsetTop = topHero.offsetHeight;
            heroHeight = topHero.offsetHeight;
        }
    }

    // ページが完全にロードされた時と、ウィンドウがリサイズされた時に寸法を更新
    window.addEventListener('load', updateDimensions);
    window.addEventListener('resize', updateDimensions);

    // スクロールイベントリスナー
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // --- 1. ナビゲーションの固定処理 ---
        if (scrollY >= navOffsetTop) {
            // ナビゲーションが固定される位置を超えたらfixedクラスを追加
            if (!mainNav.classList.contains('fixed-nav')) {
                mainNav.classList.add('fixed-nav');
                // ナビゲーションが固定されたときにコンテンツが上にずれるのを防ぐ
                // header要素に既にpaddingがある場合、その分を考慮するか、
                // bodyのpadding-topを調整する
                document.body.style.paddingTop = mainNav.offsetHeight + 'px';
            }
        } else {
            // 固定位置に戻ったらfixedクラスを削除
            if (mainNav.classList.contains('fixed-nav')) {
                mainNav.classList.remove('fixed-nav');
                document.body.style.paddingTop = '0'; // パディングを元に戻す
            }
        }

        // --- 2. メイン画像のフェードアウト処理 ---
        if (heroImage) {
            const fadeStartRatio = 0.5; // ヒーローセクションの高さの50%スクロールでフェードアウト開始
            const fadeEndRatio = 0.9;   // ヒーローセクションの高さの90%スクロールでフェードアウト完了

            const fadeStartPoint = heroHeight * fadeStartRatio;
            const fadeEndPoint = heroHeight * fadeEndRatio;

            if (scrollY < fadeStartPoint) {
                heroImage.style.opacity = 1; // フェード開始前は完全に表示
            } else if (scrollY >= fadeEndPoint) {
                heroImage.style.opacity = 0; // フェード完了後は完全に非表示
            } else {
                // フェードアウトの計算
                // スクロール量がfadeStartPointからfadeEndPointの間にある場合
                const scrolledIntoFadeZone = scrollY - fadeStartPoint;
                const fadeZoneHeight = fadeEndPoint - fadeStartPoint;
                heroImage.style.opacity = 1 - (scrolledIntoFadeZone / fadeZoneHeight);
            }
        }
    });

    // 初回ロード時にも寸法を更新しておく（deferがあるためDOM構築後に実行される）
    updateDimensions();
});