
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';

import useNotices from '../../hooks/useNotices';
import FadeIn from '../../components/FadeIn';

export default function HomeScreen() {
  const { notices, isLoading, error, reload } = useNotices();

  // Carregamento inicial
  if (isLoading && notices.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.message}>Carregando avisos...</Text>
      </View>
    );
  }

  // Erro sem avisos carregados
  if (error && notices.length === 0) {
    return (
      <View style={styles.center}>
        <View style={styles.errorCard}>
          <Text style={styles.errorIcon}>!</Text>
          <Text style={styles.errorTitle}>
            Não foi possível carregar os avisos
          </Text>
          <Text style={styles.error}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={reload}
          >
            <Text style={styles.retryButtonText}>
              Tentar novamente
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notices}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={reload}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>C</Text>
            </View>

            <Text style={styles.heading}>
              Mural de avisos
            </Text>

            <Text style={styles.subtitle}>
              Fique por dentro das últimas informações
              e novidades do campus.
            </Text>

            <View style={styles.noticeInfo}>
              <Text style={styles.noticeInfoText}>
                {notices.length} {notices.length === 1 ? 'aviso disponível' : 'avisos disponíveis'}
              </Text>
              <Text style={styles.refreshHint}>
                Puxe para atualizar
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              Nenhum aviso disponível
            </Text>
            <Text style={styles.emptyText}>
              Volte mais tarde para conferir as novidades.
            </Text>
          </View>
        }
        ListFooterComponent={
          error && notices.length > 0 ? (
            <View style={styles.inlineError}>
              <Text style={styles.inlineErrorText}>
                Não foi possível atualizar os avisos. Exibindo os dados anteriores.
              </Text>
              <Pressable onPress={reload}>
                <Text style={styles.inlineRetry}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <FadeIn delay={index * 60}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Text style={styles.cardIconText}>!</Text>
                </View>

                <Text style={styles.cardLabel}>
                  AVISO DO CAMPUS
                </Text>
              </View>

              <Text style={styles.cardTitle}>
                {item.title}
              </Text>

              <Text style={styles.cardBody}>
                {item.body}
              </Text>
            </View>
          </FadeIn>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FC',
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 30,
    flexGrow: 1,
  },

  header: {
    marginBottom: 22,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  headerIconText: {
    color: '#2563EB',
    fontSize: 25,
    fontWeight: 'bold',
  },

  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#173B80',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 7,
    lineHeight: 21,
  },

  noticeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#DCE5F2',
  },

  noticeInfoText: {
    color: '#173B80',
    fontSize: 13,
    fontWeight: 'bold',
  },

  refreshHint: {
    color: '#94A3B8',
    fontSize: 11,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 19,
    borderRadius: 17,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  cardIcon: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  cardIconText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 16,
  },

  cardLabel: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#173B80',
    marginBottom: 9,
    textTransform: 'capitalize',
    lineHeight: 24,
  },

  cardBody: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F3F6FC',
  },

  message: {
    marginTop: 13,
    fontSize: 15,
    color: '#64748B',
  },

  errorCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 24,
    alignItems: 'center',
  },

  errorIcon: {
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    fontSize: 24,
    fontWeight: 'bold',
    width: 45,
    height: 45,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
  },

  errorTitle: {
    color: '#173B80',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  error: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },

  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 11,
    marginTop: 20,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },

  emptyTitle: {
    color: '#173B80',
    fontSize: 16,
    fontWeight: 'bold',
  },

  emptyText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },

  inlineError: {
    backgroundColor: '#FEF2F2',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },

  inlineErrorText: {
    color: '#B91C1C',
    fontSize: 13,
  },

  inlineRetry: {
    color: '#2563EB',
    fontWeight: 'bold',
    marginTop: 8,
  },
});
