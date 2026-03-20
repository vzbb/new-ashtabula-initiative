import { AnimalType } from '../data/animals';

type Point = [number, number];
interface CutPath {
  id: string;
  label: string;
  d: string;
  center: Point;
}

const cowPaths: CutPath[] = [
  { id: 'head', label: 'HEAD', d: 'M 180,160 C 160,140 130,140 110,160 C 90,180 90,220 120,240 C 140,250 160,245 180,240 Z', center: [140, 190] },
  { id: 'neck', label: 'NECK', d: 'M 180,160 L 180,240 C 210,250 230,255 250,260 L 250,145 C 220,148 200,152 180,160 Z', center: [215, 200] },
  { id: 'c-chuck', label: 'CHUCK', d: 'M 250,145 C 290,135 340,135 380,140 L 380,270 C 340,268 290,265 250,260 Z', center: [315, 200] },
  { id: 'c-brisket', label: 'BRISKET', d: 'M 250,260 C 290,265 340,268 380,270 L 380,310 C 340,315 290,305 280,290 C 270,280 260,270 250,260 Z', center: [320, 285] },
  { id: 'c-rib', label: 'RIB', d: 'M 380,140 C 410,142 450,144 480,145 L 480,260 C 450,264 410,268 380,270 Z', center: [430, 200] },
  { id: 'c-shortplate', label: 'PLATE', d: 'M 380,270 C 410,268 450,264 480,260 L 480,310 C 450,315 410,315 380,310 Z', center: [430, 290] },
  { id: 'c-loin', label: 'LOIN', d: 'M 480,145 C 520,146 560,148 600,150 L 600,240 C 560,245 520,252 480,260 Z', center: [540, 195] },
  { id: 'c-flank', label: 'FLANK', d: 'M 480,260 C 520,252 560,245 600,240 L 680,240 L 680,330 C 620,350 540,340 480,310 Z', center: [580, 290] },
  { id: 'c-sirloin', label: 'SIRLOIN', d: 'M 600,150 C 630,152 660,155 680,160 L 680,240 L 600,240 Z', center: [640, 195] },
  { id: 'c-round', label: 'ROUND', d: 'M 680,160 C 720,170 750,190 760,240 C 770,290 750,330 740,340 L 680,330 Z', center: [720, 250] },
  { id: 'c-shank', label: 'SHANK', d: 'M 280,290 C 290,300 310,305 320,310 L 320,420 L 290,420 C 285,380 280,340 280,290 Z', center: [305, 360] },
  { id: 'c-shank-hind', label: 'SHANK', d: 'M 680,330 L 740,340 L 720,440 L 690,440 C 685,400 680,360 680,330 Z', center: [710, 390] },
  { id: 'tail', label: '', d: 'M 760,240 C 780,250 780,280 770,300 C 765,280 760,260 760,240 Z', center: [770, 260] }
];

const pigPaths: CutPath[] = [
  { id: 'head', label: 'HEAD', d: 'M 220,200 C 190,190 160,200 140,220 C 120,240 120,270 140,280 L 180,290 C 200,295 210,298 220,300 Z', center: [170, 245] },
  { id: 'p-jowl', label: 'JOWL', d: 'M 180,290 C 160,300 180,320 200,320 C 210,320 215,310 220,300 Z', center: [195, 305] },
  { id: 'p-shoulder', label: 'BOSTON\nBUTT', d: 'M 220,200 C 250,185 290,180 320,180 L 320,260 L 220,260 Z', center: [270, 220] },
  { id: 'p-picnic', label: 'PICNIC', d: 'M 220,260 L 320,260 L 320,320 C 290,320 250,315 220,300 Z', center: [270, 290] },
  { id: 'p-loin', label: 'LOIN', d: 'M 320,180 C 400,175 490,180 580,190 L 580,260 L 320,260 Z', center: [450, 220] },
  { id: 'p-spareribs', label: 'SPARE\nRIBS', d: 'M 320,260 L 460,260 L 460,330 C 410,335 360,330 320,320 Z', center: [390, 295] },
  { id: 'p-belly', label: 'BELLY', d: 'M 460,260 L 580,260 L 580,320 C 540,330 500,335 460,330 Z', center: [520, 295] },
  { id: 'p-ham', label: 'HAM', d: 'M 580,190 C 630,200 670,220 680,260 C 690,300 640,315 580,320 Z', center: [630, 260] },
  { id: 'p-hock-front', label: 'HOCK', d: 'M 240,305 C 260,310 275,312 280,315 L 280,400 L 250,400 C 245,370 240,340 240,305 Z', center: [265, 360] },
  { id: 'p-hock-hind', label: 'HOCK', d: 'M 600,315 C 620,312 635,310 640,310 L 630,400 L 600,400 C 595,370 595,340 600,315 Z', center: [620, 360] },
  { id: 'tail', label: '', d: 'M 680,260 C 710,240 720,270 700,280 C 690,270 685,265 680,260 Z', center: [700, 260] }
];

const chickenPaths: CutPath[] = [
  { id: 'head', label: 'HEAD', d: 'M 250,150 C 230,100 190,100 180,120 C 170,140 180,160 200,180 C 220,190 235,195 250,200 Z', center: [215, 150] },
  { id: 'ch-breast', label: 'BREAST', d: 'M 250,200 C 200,240 180,300 200,340 C 220,380 280,410 350,400 L 400,380 L 400,200 Z', center: [300, 300] },
  { id: 'ch-wing', label: 'WING', d: 'M 250,200 L 400,200 C 430,160 400,120 350,120 C 300,120 270,160 250,200 Z', center: [330, 160] },
  { id: 'ch-thigh', label: 'THIGH', d: 'M 400,200 L 400,380 C 460,390 520,360 550,300 C 560,260 560,220 550,200 Z', center: [480, 290] },
  { id: 'ch-drumstick', label: 'DRUMSTICK', d: 'M 500,380 C 470,430 460,460 480,480 C 500,500 540,460 550,420 C 560,380 560,340 550,300 Z', center: [515, 420] },
  { id: 'tail', label: 'TAIL', d: 'M 550,200 C 600,160 650,140 680,200 C 700,240 650,270 600,280 C 580,290 560,295 550,300 Z', center: [610, 220] }
];

interface CutDiagramProps {
  animalType: AnimalType;
  selectedCutId: string | null;
  onSelectCut: (id: string) => void;
}

export default function CutDiagram({ animalType, selectedCutId, onSelectCut }: CutDiagramProps) {
  const paths = animalType === 'cow' ? cowPaths : animalType === 'pig' ? pigPaths : chickenPaths;

  const handlePathClick = (id: string) => {
    // Map hind/front variants to the main cut id
    const mappedId = id.replace('-hind', '').replace('-front', '');
    onSelectCut(mappedId);
  };

  return (
    <div className="w-full aspect-video bg-white rounded-3xl border border-stone-200 overflow-hidden flex items-center justify-center p-4 md:p-8 shadow-sm relative">
      <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-xl">
        {paths.map((path, i) => {
          const mappedId = path.id.replace('-hind', '').replace('-front', '');
          const isSelected = selectedCutId === mappedId;
          const isSelectable = mappedId.startsWith('c-') || mappedId.startsWith('p-') || mappedId.startsWith('ch-');
          
          return (
            <g 
              key={i} 
              onClick={() => isSelectable && handlePathClick(path.id)}
              className={isSelectable ? 'cursor-pointer outline-none' : ''}
              style={{ transformOrigin: `${path.center[0]}px ${path.center[1]}px` }}
            >
              <path
                d={path.d}
                className={`
                  transition-all duration-300 ease-out
                  ${isSelected 
                    ? 'fill-amber-500 stroke-amber-100 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)] z-10' 
                    : 'fill-stone-800 stroke-stone-950 hover:fill-stone-700'
                  }
                `}
                strokeWidth={isSelected ? "3" : "2"}
                strokeLinejoin="round"
              />
              {path.label && (
                <text
                  x={path.center[0]}
                  y={path.center[1]}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className={`
                    font-serif font-bold text-sm pointer-events-none select-none transition-colors duration-300
                    ${isSelected ? 'fill-stone-900 drop-shadow-sm' : 'fill-white'}
                  `}
                  style={{ letterSpacing: '0.1em' }}
                >
                  {path.label.split('\n').map((line, idx) => (
                    <tspan key={idx} x={path.center[0]} dy={idx === 0 ? 0 : 16}>{line}</tspan>
                  ))}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
