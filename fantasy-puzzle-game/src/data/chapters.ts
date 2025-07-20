import { Chapter } from '@/types/game';

export const chapters: Record<string, Chapter> = {
  prologue: {
    id: 'prologue',
    title: 'プロローグ - 謎の古代遺跡',
    description: '古代魔法の謎に満ちた遺跡で目覚めた冒険者の物語が始まる',
    story: [
      '気がつくと、あなたは古い石造りの部屋にいた。',
      '壁には古代文字が刻まれ、微かに光を放っている。',
      '記憶が曖昧だが、この遺跡に何か重要な目的があったような...',
      'まずは自分の名前を思い出そう。'
    ],
    puzzles: [
      {
        id: 'name_input',
        type: 'input',
        question: 'あなたの名前を入力してください',
        answer: '',
        hint: ['自分の好きな名前を入力しましょう'],
      },
      {
        id: 'ancient_riddle',
        type: 'input',
        question: '壁に刻まれた古代文字を読み解け：「光なき夜に道を示し、闇を切り裂く白き刃」',
        answer: '月',
        hint: [
          '夜空を見上げてみましょう',
          '白く光る天体といえば...',
          '答えは一文字です'
        ],
        nextChapter: 'chapter1'
      }
    ]
  },
  
  chapter1: {
    id: 'chapter1',
    title: 'チャプター1 - 魔法の図書館',
    description: '古代の知識が眠る魔法の図書館で新たな謎と出会う',
    story: [
      '古代文字の謎を解くと、隠し扉が開いた。',
      '中は広大な図書館で、無数の本が宙に浮いている。',
      '中央の机に古い羊皮紙が置かれ、そこには新たな謎が...',
      '「この図書館の真の秘密を知りたくば、3つの試練を乗り越えよ」'
    ],
    puzzles: [
      {
        id: 'floating_books',
        type: 'choice',
        question: '浮いている本の中から正しい順番を選べ。ヒント：魔法の基本原理',
        choices: [
          '火→水→風→土',
          '土→火→水→風', 
          '風→土→火→水',
          '水→風→土→火'
        ],
        correctChoice: 1,
        hint: [
          '古典的な四大元素の順番を考えてみましょう',
          '「大地が根付き、炎が燃え、水が流れ、風が舞う」',
          '生命の誕生順序のようなものです'
        ]
      },
      {
        id: 'magic_calculation',
        type: 'input',
        question: '魔力の計算式：「月の満ち欠けは29.5日。今日が新月なら、次の満月まで何日？」',
        answer: '14',
        hint: [
          '新月から満月までは半分の期間です',
          '29.5を2で割ってみましょう',
          '小数点以下は切り捨てます'
        ]
      },
      {
        id: 'library_secret',
        type: 'special',
        question: 'この図書館の真の秘密を発見せよ。ヒント：ページのソースに注目',
        answer: 'knowledge',
        hint: [
          'ブラウザの開発者ツールを使ってみましょう',
          'HTMLコメントを探してみてください',
          '<!-- secret: knowledge --> のような形で隠されています'
        ],
        nextChapter: 'chapter2'
      }
    ]
  }
};