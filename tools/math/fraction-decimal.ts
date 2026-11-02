import { DecimalEngine } from "../_engines/engine-fraction-decimal";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "fraction-decimal",
  category: "utility",
  icon: "swap",
  engine: { component: DecimalEngine },
  related: ["fraction-add-subtract", "fraction-multiply-divide", "fraction-simplify", "fraction-mixed"],
  copy: {
    en: {
      name: "Fraction ↔ Decimal Converter",
      tagline:
        "Convert fractions to decimals with repeating digits marked, and decimals back to the closest fraction within your denominator limit.",
      intro: [
        "Two conversions, one tool. Fraction to decimal: exact long division that detects repeating cycles, so 1/3 reads 0.3̄ instead of a rounded 0.33, and 22/7 shows its six-digit repetend 142857. Decimal to fraction: a continued-fraction search that returns 1/2 for 0.5 and 1/8 for 0.125, and the closest fraction with a denominator you choose when the decimal never ends — 0.333 comes back as 1/3 with a denominator limit of 100.",
        "The check line converts the answer back into a decimal, so you always see how exact the conversion is. Every terminating decimal converts exactly; every fraction lands on a terminating or repeating decimal, never anything else — that is a theorem, not a promise.",
      ],
      steps: [
        "Pick a direction: fraction → decimal or decimal → fraction.",
        "For fraction → decimal, enter the fraction; repeating digits get an overline.",
        "For decimal → fraction, type the decimal and choose the maximum denominator.",
        "Read the answer and the check line showing how close it lands.",
      ],
      faqs: [
        {
          q: "Why does 1/3 show as 0.3̄ with a bar?",
          a: "The bar is the standard notation for an endlessly repeating digit: 0.3̄ means 0.333333… forever. Writing plain 0.33 would be a different, smaller number. The tool never rounds silently — it marks the repetend instead.",
        },
        {
          q: "How does decimal → fraction pick 1/3 for 0.333?",
          a: "A continued-fraction search walks through the best rational approximations of the value and stops at the closest one whose denominator fits your limit. With a limit of 100 that is 1/3; raise the limit to 1000 and the exact 333/1000 appears instead.",
        },
        {
          q: "Is 22/7 really equal to π?",
          a: "No — it is the classic upper-bound approximation. The converter shows 22/7 as 3.142857 with 142857 repeating, while π = 3.14159265… diverges after the second decimal. Converting a decimal you measured never invents exactness it does not have.",
        },
        {
          q: "How large a denominator should I allow?",
          a: "Whatever your context needs. Denominators up to 10,000 work fine, but a fraction like 355/113 is rarely more useful than 3 16/113. Small denominators are easier to reason about, and the check line tells you what precision you gave up.",
        },
      ],
    },
    zh: {
      name: "分数小数互转",
      tagline: "分数转小数会标出循环位;小数转分数在分母上限内给出精确或最接近的分数,并附验算。",
      intro: [
        "两个方向,一个工具。分数 → 小数:精确长除法并检测循环节,1/3 显示为 0.3̄ 而不是四舍五入的 0.33,22/7 会展示它的六位循环节 142857。小数 → 分数:连分数搜索,0.5 得 1/2,0.125 得 1/8;小数除不尽时,在自选分母上限内找最接近的分数——0.333 在上限 100 时得到 1/3。",
        "验算一行把答案换回小数,转换有多精确一眼可见。所有有限小数都能精确转换;任何分数的小数要么有限要么循环,不会有第三种形态——这是定理,不是承诺。",
      ],
      steps: [
        "选择方向:分数 → 小数,或小数 → 分数。",
        "分数 → 小数:输入分数,循环位会加上划线。",
        "小数 → 分数:输入小数并选择分母上限。",
        "查看答案和验算行,确认转换精度。",
      ],
      faqs: [
        {
          q: "1/3 为什么显示成 0.3̄(带横线)?",
          a: "横线是无限循环位的标准记法:0.3̄ 表示 0.333333… 永远循环。直接写 0.33 是另一个更小的数。工具不会悄悄四舍五入,而是标出循环节。",
        },
        {
          q: "小数转分数时,0.333 怎么得出 1/3?",
          a: "连分数搜索会沿着这个值最好的有理逼近走,停在分母不超过上限的最接近者。上限 100 时是 1/3;把上限调到 1000,就会给出精确的 333/1000。",
        },
        {
          q: "22/7 真的等于 π 吗?",
          a: "不——它是经典的上界近似。转换器把 22/7 显示为 3.142857(142857 循环),而 π = 3.14159265… 在小数第二位之后就分道扬镳。把量出来的小数转成分数,工具不会编造它没有的精确度。",
        },
        {
          q: "分母上限该设多大?",
          a: "看你的场景。上限 10000 也没问题,但像 355/113 这样的分数通常不如 3 16/113 实用。小分母更容易心算,验算行会告诉你放弃了多少精度。",
        },
      ],
    },
    ja: {
      name: "分数 ⇄ 小数 変換",
      tagline: "分数から小数は循環桁にバーを付けて表示。小数から分数は分母の上限内で最も近い分数を返し、検算付きです。",
      intro: [
        "両方向をひとつのツールに。分数 → 小数:正確な筆算で循環節を検出し、1/3 は丸めた 0.33 ではなく 0.3̄ と表示、22/7 なら 6 桁の循環節 142857 を見せます。小数 → 分数:連分数探索で 0.5 は 1/2、0.125 は 1/8。割り切れない小数は、指定した分母の上限内で最も近い分数を返します。0.333 は上限 100 で 1/3 です。",
        "検算行が答えを小数に戻して表示するので、変換の精度はいつも目で確かめられます。有限小数は必ず正確に変換でき、分数の小数は有限か循環のどちらか。それ以外はありえません——これは定理であり、宣言ではありません。",
      ],
      steps: [
        "方向を選びます。分数 → 小数 か 小数 → 分数。",
        "分数 → 小数では分数を入力します。循環桁にバーが付きます。",
        "小数 → 分数では小数を入力し、分母の上限を選びます。",
        "答えと検算行を見て、どれだけ近いかを確認します。",
      ],
      faqs: [
        {
          q: "1/3 が 0.3̄(バー付き)になるのは?",
          a: "バーは永遠に繰り返す桁の標準記法で、0.3̄ は 0.333333… の意味です。ただの 0.33 では別の、より小さい数になってしまいます。ツールは黙って丸めず、循環節を示します。",
        },
        {
          q: "小数 → 分数で 0.333 から 1/3 を選ぶ仕組みは?",
          a: "連分数探索がその値の最良の有理近似をたどり、分母が上限内の最も近いもので止まります。上限 100 なら 1/3。上限を 1000 に上げると正確な 333/1000 が出ます。",
        },
        {
          q: "22/7 は本当に π と等しい?",
          a: "等しくありません。古典的な上からの近似です。このツールは 22/7 を 3.142857(142857 循環)と表示し、π = 3.14159265… は小数第 2 位から離れていきます。測定した小数を分数にしても、ない精度をでっち上げません。",
        },
        {
          q: "分母の上限はいくらにすべき?",
          a: "用途次第です。10000 まで問題なく動きますが、355/113 のような分数は 3 16/113 より便利なことはめったにありません。小さい分母のほうが見当がつきやすく、検算行が諦めた精度を教えます。",
        },
      ],
    },
    es: {
      name: "Conversor fracción ↔ decimal",
      tagline:
        "Convierte fracciones a decimales marcando los dígitos periódicos, y decimales a la fracción más cercana dentro de tu límite de denominador.",
      intro: [
        "Dos conversiones, una herramienta. Fracción a decimal: división exacta que detecta los períodos, así que 1/3 se lee 0.3̄ en vez de un 0,33 redondeado, y 22/7 muestra su período de seis cifras 142857. Decimal a fracción: una búsqueda por fracciones continuas que devuelve 1/2 para 0.5 y 1/8 para 0.125, y la fracción más cercana con el denominador que elijas cuando el decimal no termina — 0.333 vuelve como 1/3 con un límite de 100.",
        "La línea de comprobación convierte la respuesta otra vez a decimal, así que siempre ves cuán exacta es la conversión. Todo decimal terminante se convierte de forma exacta; toda fracción acaba en un decimal terminante o periódico, nunca otra cosa: es un teorema, no una promesa.",
      ],
      steps: [
        "Elija la dirección: fracción → decimal o decimal → fracción.",
        "Para fracción → decimal, introduzca la fracción; los dígitos periódicos llevan barra.",
        "Para decimal → fracción, escriba el decimal y elija el denominador máximo.",
        "Lea la respuesta y la línea de comprobación con la distancia final.",
      ],
      faqs: [
        {
          q: "¿Por qué 1/3 aparece como 0.3̄ con una barra?",
          a: "La barra es la notación estándar del dígito que se repite sin fin: 0.3̄ significa 0.333333… para siempre. Un 0,33 plano sería otro número, más pequeño. La herramienta nunca redondea en silencio: marca el período.",
        },
        {
          q: "¿Cómo elige 1/3 para 0.333?",
          a: "Una búsqueda por fracciones continuas recorre las mejores aproximaciones racionales del valor y se detiene en la más cercana cuyo denominador cabe en su límite. Con límite 100 es 1/3; súbelo a 1000 y aparece la exacta 333/1000.",
        },
        {
          q: "¿22/7 es de verdad π?",
          a: "No — es la aproximación clásica por arriba. El conversor muestra 22/7 como 3.142857 con 142857 periódico, mientras que π = 3.14159265… se separa a partir del segundo decimal. Convertir un decimal medido nunca inventa exactitud que no tiene.",
        },
        {
          q: "¿Qué denominador máximo conviene?",
          a: "El que pida tu contexto. Hasta 10.000 funciona bien, pero una fracción como 355/113 rara vez es más útil que 3 16/113. Los denominadores pequeños se razonan mejor, y la línea de comprobación dice cuánta precisión cedió.",
        },
      ],
    },
    pt: {
      name: "Conversor fração ↔ decimal",
      tagline:
        "Converta frações em decimais marcando os dígitos periódicos, e decimais na fração mais próxima dentro do seu limite de denominador.",
      intro: [
        "Duas conversões, uma ferramenta. Fração para decimal: divisão exata que detecta os períodos, então 1/3 lê-se 0.3̄ em vez de um 0,33 arredondado, e 22/7 mostra seu período de seis dígitos 142857. Decimal para fração: uma busca por frações continuadas que devolve 1/2 para 0.5 e 1/8 para 0.125, e a fração mais próxima com o denominador que você escolher quando o decimal não termina — 0.333 volta como 1/3 com limite 100.",
        "A linha de verificação converte a resposta de volta em decimal, então você sempre vê o quão exata é a conversão. Todo decimal exato se converte exatamente; toda fração vira um decimal exato ou periódico, nunca outra coisa — isso é um teorema, não uma promessa.",
      ],
      steps: [
        "Escolha a direção: fração → decimal ou decimal → fração.",
        "Para fração → decimal, informe a fração; os dígitos periódicos ganham uma barra.",
        "Para decimal → fração, digite o decimal e escolha o denominador máximo.",
        "Leia a resposta e a linha de verificação com a distância final.",
      ],
      faqs: [
        {
          q: "Por que 1/3 aparece como 0.3̄ com uma barra?",
          a: "A barra é a notação padrão do dígito que repete sem fim: 0.3̄ significa 0.333333… para sempre. Um 0,33 simples seria outro número, menor. A ferramenta nunca arredonda em silêncio — marca o período.",
        },
        {
          q: "Como decimal → fração escolhe 1/3 para 0.333?",
          a: "Uma busca por frações continuadas percorre as melhores aproximações racionais do valor e para na mais próxima cujo denominador cabe no seu limite. Com limite 100 é 1/3; suba para 1000 e aparece a exata 333/1000.",
        },
        {
          q: "22/7 é mesmo igual a π?",
          a: "Não — é a aproximação clássica por cima. O conversor mostra 22/7 como 3.142857 com 142857 repetindo, enquanto π = 3.14159265… se separa a partir do segundo decimal. Converter um decimal medido nunca inventa exatidão que não existe.",
        },
        {
          q: "Qual denominador máximo usar?",
          a: "O que o seu contexto pedir. Até 10.000 funciona bem, mas uma fração como 355/113 raramente é mais útil que 3 16/113. Denominadores pequenos são mais fáceis de raciocinar, e a linha de verificação diz quanta precisão você abriu mão.",
        },
      ],
    },
  },
});
