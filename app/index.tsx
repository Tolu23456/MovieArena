import React from 'react';
import { View } from 'react-native';
import { Rail } from '@/components/Card';
import { Footer } from '@/components/Footer';
import { HeroCarousel } from '@/components/HeroCarousel';
import { mediaCatalog, top10 } from '@/data/catalog';
import { useMediaCatalog } from '@/data/media';
import { useLayout } from '@/hooks/useLayout';

/** Home — latest carousel, server catalog, Top 10, footer. */
export default function Home() {
  const layout = useLayout();
  // Subscribe so the donghua rail fills in once catalog.json lands.
  const { status } = useMediaCatalog();
  const serverTitles = React.useMemo(() => mediaCatalog(), [status]);

  return (
    <View style={{ position: 'relative' }}>
      <HeroCarousel layout={layout} />

      {serverTitles.length ? (
        <View testID="rail-server">
          <Rail
            title="Donghua · streaming from our server"
            items={serverTitles}
            cardWidth={layout.cardWidth}
          />
        </View>
      ) : null}

      <View testID="rail-top10">
        <Rail title="Top 10 this week" items={top10} cardWidth={layout.cardWidth} />
      </View>

      <Footer />
    </View>
  );
}
