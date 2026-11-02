import { AddSubEngine } from "../_engines/engine-fraction-add-subtract";
import { defineTool } from "../_lib/types";

export default defineTool({
  slug: "fraction-add-subtract",
  category: "utility",
  icon: "calc",
  featured: true,
  engine: { component: AddSubEngine },
  related: ["fraction-multiply-divide", "fraction-simplify", "fraction-decimal", "fraction-mixed"],
  copy: {
    en: {
      name: "Add & Subtract Fractions",
      tagline:
        "Add or subtract any two fractions with the LCD worked out for you — simplified result, mixed number and decimal, every step shown.",
      intro: [
        "Adding 1/2 and 1/3 is not 2/5 — the denominators have to match first. This calculator finds the least common denominator, rewrites both fractions as equivalents, adds or subtracts the numerators, and simplifies the result. You see every move, so it doubles as a homework checker: enter the exercise, compare the steps, and find exactly where you went wrong.",
        "Unlike a plain calculator, the answer comes in all three forms teachers ask for: the fraction in lowest terms, the mixed number when the result is improper, and the decimal. Negative fractions work too — subtracting the larger fraction correctly lands below zero, as in 1/2 − 3/4 = −1/4.",
      ],
      steps: [
        "Type the numerator and denominator of the first fraction.",
        "Choose add (+) or subtract (−), then enter the second fraction.",
        "Read the simplified result, plus its mixed-number and decimal forms.",
        "Follow the steps: common denominator, equivalent fractions, combined numerators, simplification.",
      ],
      faqs: [
        {
          q: "Why do I need a common denominator?",
          a: "Fraction bars with different denominators count pieces of different sizes, so 1/2 and 1/3 cannot be combined directly. Rewriting them over the least common denominator — here 6 — makes the pieces the same size: 1/2 = 3/6 and 1/3 = 2/6, which add to 5/6.",
        },
        {
          q: "What if one denominator is already a multiple of the other?",
          a: "The least common denominator is simply the larger one. For 1/4 + 5/12 the LCD is 12, only the quarter needs rewriting (1/4 = 3/12), and the sum is 3/12 + 5/12 = 8/12, which simplifies to 2/3.",
        },
        {
          q: "Can the result be negative or greater than 1?",
          a: "Both. Subtracting the larger fraction gives a negative result, such as 1/2 − 3/4 = −1/4. Improper results are shown as a mixed number as well: 3/4 + 2/3 = 17/12 = 1 5/12.",
        },
        {
          q: "Is the answer always fully simplified?",
          a: "Yes. After combining, the calculator divides the numerator and denominator by their GCD, so 1/6 + 1/6 comes out as 1/3 rather than 2/6, and 1/4 + 1/4 comes out as 1/2.",
        },
      ],
    },
    zh: {
      name: "分数加减法计算器",
      tagline: "两个分数相加或相减,自动求最小公分母、逐步演算,并给出最简分数、带分数和小数三种结果。",
      intro: [
        "1/2 加 1/3 并不等于 2/5——分母不同,不能直接相加。本计算器先求最小公分母,把两个分数化成同分母的等价分数,再加减分子、约分。每一步都完整展示,既能算题,也能当作业检查器:输入题目,对照步骤,找到出错的那一步。",
        "和普通计算器不同,结果按老师要求的三种形式同时给出:最简分数、(结果是假分数时的)带分数,以及小数。负数也没问题——大数减小数会正确落到零以下,例如 1/2 − 3/4 = −1/4。",
      ],
      steps: [
        "输入第一个分数的分子和分母。",
        "选择加(+)或减(−),再输入第二个分数。",
        "查看化简后的结果,以及对应的带分数和小数。",
        "按步骤核对:求公分母、化等价分数、分子相加减、约分。",
      ],
      faqs: [
        {
          q: "为什么必须先通分?",
          a: "分母不同,每一份的大小就不同,1/2 和 1/3 不能直接相加。化成以最小公分母(这里是 6)为分母的等价分数后,每一份大小一致:1/2 = 3/6,1/3 = 2/6,相加得 5/6。",
        },
        {
          q: "一个分母是另一个的倍数时会怎样?",
          a: "此时最小公分母就是较大的那个分母。例如 1/4 + 5/12,公分母取 12,只需改写 1/4 = 3/12,和为 3/12 + 5/12 = 8/12,约分得 2/3。",
        },
        {
          q: "结果可以是负数或大于 1 吗?",
          a: "都可以。用较大的分数去减会得到负数,如 1/2 − 3/4 = −1/4;结果是假分数时会同时给出带分数,如 3/4 + 2/3 = 17/12 = 1 5/12。",
        },
        {
          q: "结果一定是最简分数吗?",
          a: "是的。合并分子后,计算器会用最大公约数把分数约到最简:1/6 + 1/6 得 1/3 而不是 2/6,1/4 + 1/4 得 1/2。",
        },
      ],
    },
    ja: {
      name: "分数の足し算・引き算",
      tagline:
        "2 つの分数の加減算を最小公倍分母から順に自動計算。既約分数・帯分数・小数の 3 形式で結果を出し、途中式もすべて表示します。",
      intro: [
        "1/2 + 1/3 は 2/5 ではありません。分母が違う分数はそのまま足せません。この計算機は最小公倍分母を求め、両方の分数を同値な分数に直してから分子を加減し、結果を約分します。途中式がすべて見えるので、宿題の検算にも使えます。",
        "答えは既約分数・(仮分数なら)帯分数・小数の 3 つで表示します。負の分数も正しく扱い、1/2 − 3/4 = −1/4 のように、大きい方を引くと 0 未満にちゃんと落ちます。",
      ],
      steps: [
        "1 番目の分数の分子と分母を入力します。",
        "足し算(+)か引き算(−)を選び、2 番目の分数を入力します。",
        "既約の結果と、帯分数・小数の形を確認します。",
        "通分 → 同値な分数 → 分子の加減 → 約分、の順に過程をたどります。",
      ],
      faqs: [
        {
          q: "なぜ通分が必要ですか?",
          a: "分母が違うとかけらの大きさが違うため、1/2 と 1/3 はそのまま足せません。最小公倍分母(この例では 6)で通分すると 1/2 = 3/6、1/3 = 2/6 となり、同じ大きさのかけらとして足して 5/6 になります。",
        },
        {
          q: "片方の分母がもう片方の倍数のときは?",
          a: "最小公倍分母は大きい方の分母そのものです。1/4 + 5/12 なら分母は 12、直すのは 1/4 = 3/12 だけで、和は 3/12 + 5/12 = 8/12、約分して 2/3 です。",
        },
        {
          q: "結果が負や 1 超えになることは?",
          a: "あります。大きい方を引くと負になります(1/2 − 3/4 = −1/4)。仮分数の結果は帯分数も表示します。3/4 + 2/3 = 17/12 = 1 5/12。",
        },
        {
          q: "結果は必ず既約ですか?",
          a: "はい。分子を計算した後、最大公約数で約分します。1/6 + 1/6 は 2/6 ではなく 1/3、1/4 + 1/4 は 1/2 と出ます。",
        },
      ],
    },
    es: {
      name: "Sumar y restar fracciones",
      tagline:
        "Suma o resta dos fracciones cualesquiera con el mínimo común denominador ya resuelto: resultado simplificado, número mixto y decimal, con todos los pasos.",
      intro: [
        "Sumar 1/2 y 1/3 no da 2/5: primero hay que igualar los denominadores. Esta calculadora encuentra el mínimo común denominador, reescribe ambas fracciones como equivalentes, suma o resta los numeradores y simplifica. Cada paso queda a la vista, así que también sirve para revisar los deberes: introduzca el ejercicio, compare los pasos y localice el error.",
        "A diferencia de una calculadora simple, la respuesta llega en las tres formas que piden los profesores: la fracción en términos mínimos, el número mixto cuando el resultado es impropio y el decimal. Las fracciones negativas también funcionan: restar la mayor cae por debajo de cero, como 1/2 − 3/4 = −1/4.",
      ],
      steps: [
        "Escriba el numerador y el denominador de la primera fracción.",
        "Elija sumar (+) o restar (−) e introduzca la segunda fracción.",
        "Lea el resultado simplificado, con su forma de número mixto y de decimal.",
        "Siga los pasos: denominador común, fracciones equivalentes, numeradores combinados y simplificación.",
      ],
      faqs: [
        {
          q: "¿Por qué hace falta un denominador común?",
          a: "Barras con denominadores distintos cuentan trozos de tamaños diferentes, así que 1/2 y 1/3 no se pueden combinar directamente. Al reescribirlas sobre el mínimo común denominador —aquí 6— los trozos se igualan: 1/2 = 3/6 y 1/3 = 2/6, que suman 5/6.",
        },
        {
          q: "¿Y si un denominador ya es múltiplo del otro?",
          a: "El mínimo común denominador es simplemente el mayor. Para 1/4 + 5/12 es 12, solo hay que reescribir el cuarto (1/4 = 3/12) y la suma es 3/12 + 5/12 = 8/12, que simplificada da 2/3.",
        },
        {
          q: "¿Puede el resultado ser negativo o mayor que 1?",
          a: "Ambos. Restar la fracción mayor da un resultado negativo, como 1/2 − 3/4 = −1/4. Los resultados impropios se muestran también como número mixto: 3/4 + 2/3 = 17/12 = 1 5/12.",
        },
        {
          q: "¿La respuesta sale siempre simplificada?",
          a: "Sí. Tras combinar, la calculadora divide numerador y denominador por su MCD: 1/6 + 1/6 sale 1/3 en vez de 2/6, y 1/4 + 1/4 sale 1/2.",
        },
      ],
    },
    pt: {
      name: "Somar e subtrair frações",
      tagline:
        "Some ou subtraia duas frações quaisquer com o mínimo denominador comum já resolvido — resultado irredutível, número misto e decimal, com todos os passos.",
      intro: [
        "Somar 1/2 e 1/3 não dá 2/5: primeiro os denominadores precisam ficar iguais. Esta calculadora encontra o mínimo denominador comum, reescreve as duas frações como equivalentes, soma ou subtrai os numeradores e simplifica. Cada passo fica visível, então também serve para conferir o dever de casa: digite o exercício, compare os passos e descubra onde errou.",
        "Diferente de uma calculadora comum, a resposta vem nas três formas que os professores pedem: a fração irredutível, o número misto quando o resultado é impróprio e o decimal. Frações negativas funcionam também: subtrair a maior cai abaixo de zero, como 1/2 − 3/4 = −1/4.",
      ],
      steps: [
        "Digite o numerador e o denominador da primeira fração.",
        "Escolha somar (+) ou subtrair (−) e informe a segunda fração.",
        "Leia o resultado simplificado, com a forma de número misto e de decimal.",
        "Siga os passos: denominador comum, frações equivalentes, numeradores combinados e simplificação.",
      ],
      faqs: [
        {
          q: "Por que é preciso um denominador comum?",
          a: "Barras com denominadores diferentes contam pedaços de tamanhos diferentes, então 1/2 e 1/3 não se somam diretamente. Reescrevendo sobre o mínimo denominador comum — aqui 6 — os pedaços ficam iguais: 1/2 = 3/6 e 1/3 = 2/6, que somam 5/6.",
        },
        {
          q: "E se um denominador já é múltiplo do outro?",
          a: "O mínimo denominador comum é simplesmente o maior. Para 1/4 + 5/12 ele é 12, só o quarto precisa ser reescrito (1/4 = 3/12) e a soma é 3/12 + 5/12 = 8/12, que simplificada dá 2/3.",
        },
        {
          q: "O resultado pode ser negativo ou maior que 1?",
          a: "Os dois. Subtrair a fração maior dá um resultado negativo, como 1/2 − 3/4 = −1/4. Resultados impróprios aparecem também como número misto: 3/4 + 2/3 = 17/12 = 1 5/12.",
        },
        {
          q: "A resposta sai sempre simplificada?",
          a: "Sim. Depois de combinar, a calculadora divide numerador e denominador pelo MDC: 1/6 + 1/6 sai 1/3 em vez de 2/6, e 1/4 + 1/4 sai 1/2.",
        },
      ],
    },
  },
});
