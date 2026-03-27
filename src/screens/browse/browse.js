import React, { useState, useEffect, useMemo } from "react"
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar
} from "react-native"
import { CustomSearch, Spacer, CustomSkeleton } from "../../components"
import { colors, scales, commonText } from "../../utils"
import { appImages, fontFamily } from "../../assets"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")
const COLUMN_WIDTH = (width - 4.2) / 3

const CATEGORIES = [
    { id: '1', title: commonText.reels, icon: appImages.play },
    { id: '2', title: 'Food', icon: null },
    { id: '3', title: 'Travel', icon: null },
    { id: '4', title: 'Design', icon: null },
    { id: '5', title: 'Music', icon: null },
    { id: '6', title: 'Art', icon: null },
    { id: '7', title: 'Sports', icon: null },
]

const DUMMY_POSTS = Array.from({ length: 90 }, (_, i) => ({
    id: `post_${i}`,
    image: appImages.post,
    isReel: i % 5 === 0,
}))

const groupIntoBlocks = (posts) => {
    const blocks = []
    let i = 0
    while (i < posts.length) {
        const row1 = posts.slice(i, i + 3)
        if (row1.length > 0) blocks.push({ id: `row_${i}_A1`, type: 'row', items: row1 })
        i += 3

        const row2 = posts.slice(i, i + 3)
        if (row2.length > 0) blocks.push({ id: `row_${i}_A2`, type: 'row', items: row2 })
        i += 3

        const featuredLeft = posts.slice(i, i + 3)
        if (featuredLeft.length === 3) {
            blocks.push({ id: `row_${i}_B`, type: 'featured-left', items: featuredLeft })
        } else if (featuredLeft.length > 0) {
            blocks.push({ id: `row_${i}_B_fallback`, type: 'row', items: featuredLeft })
        }
        i += 3

        const featuredRight = posts.slice(i, i + 3)
        if (featuredRight.length === 3) {
            blocks.push({ id: `row_${i}_C`, type: 'featured-right', items: featuredRight })
        } else if (featuredRight.length > 0) {
            blocks.push({ id: `row_${i}_C_fallback`, type: 'row', items: featuredRight })
        }
        i += 3
    }
    return blocks
}

const SKELETON_BLOCKS = [
    { id: 's1', type: 'row' },
    { id: 's2', type: 'row' },
    { id: 's3', type: 'featured-left' },
    { id: 's4', type: 'row' },
    { id: 's5', type: 'featured-right' },
]

export const Browse = () => {
    const insets = useSafeAreaInsets()
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState('1')
    
    const blocks = useMemo(() => groupIntoBlocks(DUMMY_POSTS), [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 2000)
        return () => clearTimeout(timer)
    }, [])

    const GridImage = ({ item, style }) => (
        <TouchableOpacity activeOpacity={0.8} style={[styles.gridItemBase, style]}>
            <Image source={item.image} style={styles.gridImage} />
            {item.isReel && (
                <View style={styles.reelIconOverlay}>
                    <Image source={appImages.play} style={styles.reelIcon} />
                </View>
            )}
        </TouchableOpacity>
    )

    const GridSkeleton = ({ style }) => (
        <CustomSkeleton variant="square" style={[styles.gridItemBase, style]} />
    )

    const renderLayout = (item, isSkeleton = false) => {
        if (item.type === 'row') {
            return (
                <View style={styles.rowLayout}>
                    {isSkeleton ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <GridSkeleton key={i} style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} />
                        ))
                    ) : (
                        item.items.map(post => (
                            <GridImage key={post.id} item={post} style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} />
                        ))
                    )}
                </View>
            )
        }

        if (item.type === 'featured-left') {
            return (
                <View style={styles.featuredLayout}>
                    {isSkeleton ? (
                         <GridSkeleton style={{ width: COLUMN_WIDTH * 2 + 1.4, height: COLUMN_WIDTH * 2 + 1.4 }} />
                    ) : (
                        <GridImage item={item.items[0]} style={{ width: COLUMN_WIDTH * 2 + 1.4, height: COLUMN_WIDTH * 2 + 1.4 }} />
                    )}
                    <View style={styles.verticalStack}>
                        {isSkeleton ? (
                            <>
                                <GridSkeleton style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} />
                                <GridSkeleton style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} />
                            </>
                        ) : (
                            <>
                                <GridImage item={item.items[1]} style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} />
                                <GridImage item={item.items[2]} style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} />
                            </>
                        )}
                    </View>
                </View>
            )
        }

        if (item.type === 'featured-right') {
            return (
                <View style={styles.featuredLayout}>
                    <View style={styles.verticalStack}>
                        {isSkeleton ? (
                            <>
                                <GridSkeleton style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} />
                                <GridSkeleton style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} />
                            </>
                        ) : (
                            <>
                                <GridImage item={item.items[0]} style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} />
                                <GridImage item={item.items[1]} style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} />
                            </>
                        )}
                    </View>
                    {isSkeleton ? (
                        <GridSkeleton style={{ width: COLUMN_WIDTH * 2 + 1.4, height: COLUMN_WIDTH * 2 + 1.4 }} />
                    ) : (
                        <GridImage item={item.items[2]} style={{ width: COLUMN_WIDTH * 2 + 1.4, height: COLUMN_WIDTH * 2 + 1.4 }} />
                    )}
                </View>
            )
        }
        return null
    }

    const listHeader = (
        <View style={styles.headerContent}>
            <CustomSearch placeholder={commonText.search} value={search} onChangeText={setSearch} />
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={CATEGORIES}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.categoriesContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.categoryChip, activeCategory === item.id && styles.activeCategoryChip]}
                        onPress={() => setActiveCategory(item.id)}
                    >
                        {item.icon && (
                            <Image 
                                source={item.icon} 
                                style={[styles.categoryIcon, { tintColor: activeCategory === item.id ? colors.black : colors.white }]} 
                            />
                        )}
                        <Text style={[styles.categoryText, activeCategory === item.id && styles.activeCategoryText]}>
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    )

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={[styles.headerContent, { paddingTop: insets.top + scales(10) }]}>
                    <CustomSkeleton variant="square" width={width - scales(32)} height={scales(46)} style={{ marginHorizontal: scales(16), borderRadius: scales(14) }} />
                    <Spacer height={scales(20)} />
                    <View style={styles.categoriesSkeletonRow}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <CustomSkeleton key={i} variant="text" width={scales(80)} height={scales(35)} style={{ marginRight: scales(10), borderRadius: scales(10) }} />
                        ))}
                    </View>
                </View>
                <FlatList
                    data={SKELETON_BLOCKS}
                    renderItem={({ item }) => renderLayout(item, true)}
                    keyExtractor={(item) => item.id}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <FlatList
                data={blocks}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={listHeader}
                renderItem={({ item }) => renderLayout(item)}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.listContent, { paddingTop: insets.top }]}
                initialNumToRender={8}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
    },
    headerContent: {
        paddingBottom: scales(10),
    },
    categoriesContainer: {
        paddingHorizontal: scales(16),
        paddingVertical: scales(12),
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scales(16),
        paddingVertical: scales(8),
        borderRadius: scales(10),
        backgroundColor: colors.profileTabsBg,
        marginRight: scales(8),
        borderWidth: 1,
        borderColor: colors.profileDivider,
    },
    activeCategoryChip: {
        backgroundColor: colors.white,
        borderColor: colors.white,
    },
    categoryIcon: {
        width: scales(14),
        height: scales(14),
        marginRight: scales(6),
    },
    categoryText: {
        color: colors.white,
        fontFamily: fontFamily.semiBold,
        fontSize: scales(14),
    },
    activeCategoryText: {
        color: colors.black,
    },
    listContent: {
        paddingBottom: scales(100),
    },
    rowLayout: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    featuredLayout: {
        flexDirection: 'row',
    },
    verticalStack: {
        flexDirection: 'column',
    },
    gridItemBase: {
        margin: 0.7,
        backgroundColor: colors.profileStatsBg,
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    reelIconOverlay: {
        position: 'absolute',
        top: scales(8),
        right: scales(8),
    },
    reelIcon: {
        width: scales(18),
        height: scales(18),
        tintColor: colors.white,
        opacity: 0.9,
    },
    categoriesSkeletonRow: {
        flexDirection: 'row',
        paddingHorizontal: scales(20),
    }
})