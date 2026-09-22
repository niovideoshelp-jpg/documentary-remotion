# Direção da edição documental

Framework final: Remotion, React e TypeScript.

## Estado

Áudio recebido: introdução Typhoon vs Rafale, inglês, 186,82775 segundos. Storyboard em STORYBOARD.md e montagem implementada em remotion-app. Revisão e exportação em andamento.

## Linguagem visual

Documentário editorial e cinematográfico com fotografias reais, colagem, arquivo documental, recortes de papel e mapas programáticos. Composição central dominante, safe areas, profundidade em background/midground/foreground e movimento controlado. Evitar cards, dashboards, layouts repetidos e slideshow de imagens com zoom.

## Referências

- Texture_EX.jpg: somente sensação material, granulação fina, impressão e papel; não copiar objetos, composição, DNA, textos ou cores.
- f29199b0698d99c21e862065c612d01e.jpg: hierarquia e tratamento cartográfico da China.
- map-bordar.jpg: separação territorial e halo discreto da referência da Índia.

As referências orientam a criação; não são mapas a serem reproduzidos literalmente.

## Mapas

Geografia real com GeoJSON, d3-geo e SVG. Oceano próximo de #243847; países secundários em cinza-bege/off-white; território principal em #B3261E ou #B72B22.

Sequência obrigatória: mapa neutro → fronteira desenhada progressivamente → halo suave → preenchimento vermelho orgânico dentro da máscara territorial → textura sutil → nome do país. Nunca deformar a geografia. Tipografia condensada, off-white e centralizada visualmente dentro do território quando possível.

## Fotografia e tipografia

Preservar conteúdo das fotografias reais. Usar molduras irregulares, recortes e sombras discretas. Fontes de referência: Anton, Bebas Neue, Oswald, Fira Sans Condensed, Lexend; escolher uma hierarquia consistente e incorporar os arquivos usados.

Texto somente para nomes, datas, números, lugares e conceitos essenciais, sem repetir frases inteiras da narração.

## Processo

1. Analisar toda a narração.
2. Criar storyboard: trecho e timecode → ideia visual → assets → composição → movimento → transição.
3. Pesquisar materiais com função narrativa e registrar origem/licença.
4. Implementar componentes modulares: Map, LiquidCountryFill, PaperCutout, DocumentaryPhoto, TextureOverlay, Camera, LocationLabel, NumberHighlight, DocumentaryTransition e CollageScene.
5. Sincronizar revelações, números e movimentos com a fala.
6. Revisar frames e transições: foco, legibilidade, safe areas, geografia, correspondência narrativa, profundidade e fluidez.
7. Renderizar e verificar o vídeo completo.

## Materiais pendentes

- Roteiro completo e/ou arquivo da narração.
- Formato de entrega caso diferente de 1920×1080, 30 fps.

Não inventar narrativa, estatísticas ou sincronização enquanto esses materiais não estiverem disponíveis.

