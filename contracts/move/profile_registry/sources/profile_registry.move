module profile_registry::profile_registry {
    use std::signer;
    use std::string::{Self, String};
    use std::vector;
    use std::error;
    use initia_std::table::{Self, Table};
    use initia_std::event;
    use initia_std::coin;
    use initia_std::fungible_asset::Metadata;
    use initia_std::object::Object;
    use initia_std::block;

    // ========== Error codes ==========
    const E_PROFILE_EXISTS: u64 = 1;
    const E_PROFILE_NOT_FOUND: u64 = 2;
    const E_BIO_TOO_LONG: u64 = 3;
    const E_AVATAR_TOO_LONG: u64 = 4;
    const E_TOO_MANY_LINKS: u64 = 5;
    const E_LINKS_LABELS_MISMATCH: u64 = 6;
    const E_ALREADY_FOLLOWING: u64 = 7;
    const E_NOT_FOLLOWING: u64 = 8;
    const E_CANNOT_FOLLOW_SELF: u64 = 9;
    const E_TIP_TOO_SMALL: u64 = 10;
    const E_LIMIT_TOO_HIGH: u64 = 11;

    const MAX_BIO_LENGTH: u64 = 280;
    const MAX_AVATAR_LENGTH: u64 = 512;
    const MAX_LINKS: u64 = 10;
    const MAX_LIMIT: u64 = 50;
    const MIN_TIP_AMOUNT: u64 = 1; // 1 GAS minimum tip (0 decimals)

    // ========== Structs ==========

    struct Profile has store, copy, drop {
        owner: address,
        bio: String,
        avatar_url: String,
        links: vector<String>,
        link_labels: vector<String>,
        total_tips: u64,
        tip_count: u64,
        follower_count: u64,
        following_count: u64,
        created_at: u64,
        exists: bool,
    }

    struct TipRecord has store, copy, drop {
        from: address,
        to: address,
        amount: u64,
        timestamp: u64,
    }

    struct FollowKey has store, copy, drop {
        follower: address,
        followed: address,
    }

    struct Registry has key {
        profiles: Table<address, Profile>,
        follows: Table<FollowKey, bool>,
        followers_list: Table<address, vector<address>>,
        following_list: Table<address, vector<address>>,
        all_profiles: vector<address>,
        tip_records: Table<address, vector<TipRecord>>,
    }

    // ========== Events ==========

    #[event]
    struct ProfileCreated has drop, store {
        owner: address,
    }

    #[event]
    struct ProfileUpdated has drop, store {
        owner: address,
    }

    #[event]
    struct TipReceived has drop, store {
        from: address,
        to: address,
        amount: u64,
    }

    #[event]
    struct Followed has drop, store {
        follower: address,
        followed: address,
    }

    #[event]
    struct Unfollowed has drop, store {
        follower: address,
        followed: address,
    }

    // ========== Init ==========

    fun init_module(account: &signer) {
        move_to(account, Registry {
            profiles: table::new(),
            follows: table::new(),
            followers_list: table::new(),
            following_list: table::new(),
            all_profiles: vector::empty(),
            tip_records: table::new(),
        });
    }

    // ========== Entry functions ==========

    public entry fun create_profile(
        account: &signer,
        bio: String,
        avatar_url: String,
        links: vector<String>,
        link_labels: vector<String>,
    ) acquires Registry {
        let sender = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@profile_registry);

        assert!(!table::contains(&registry.profiles, sender), error::already_exists(E_PROFILE_EXISTS));
        assert!(string::length(&bio) <= MAX_BIO_LENGTH, error::invalid_argument(E_BIO_TOO_LONG));
        assert!(string::length(&avatar_url) <= MAX_AVATAR_LENGTH, error::invalid_argument(E_AVATAR_TOO_LONG));
        assert!(vector::length(&links) <= MAX_LINKS, error::invalid_argument(E_TOO_MANY_LINKS));
        assert!(vector::length(&links) == vector::length(&link_labels), error::invalid_argument(E_LINKS_LABELS_MISMATCH));

        let (_, timestamp) = block::get_block_info();

        let profile = Profile {
            owner: sender,
            bio,
            avatar_url,
            links,
            link_labels,
            total_tips: 0,
            tip_count: 0,
            follower_count: 0,
            following_count: 0,
            created_at: timestamp,
            exists: true,
        };

        table::add(&mut registry.profiles, sender, profile);
        vector::push_back(&mut registry.all_profiles, sender);

        event::emit(ProfileCreated { owner: sender });
    }

    public entry fun update_bio(
        account: &signer,
        new_bio: String,
    ) acquires Registry {
        let sender = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@profile_registry);

        assert!(table::contains(&registry.profiles, sender), error::not_found(E_PROFILE_NOT_FOUND));
        assert!(string::length(&new_bio) <= MAX_BIO_LENGTH, error::invalid_argument(E_BIO_TOO_LONG));

        let profile = table::borrow_mut(&mut registry.profiles, sender);
        profile.bio = new_bio;

        event::emit(ProfileUpdated { owner: sender });
    }

    public entry fun update_avatar(
        account: &signer,
        new_avatar_url: String,
    ) acquires Registry {
        let sender = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@profile_registry);

        assert!(table::contains(&registry.profiles, sender), error::not_found(E_PROFILE_NOT_FOUND));
        assert!(string::length(&new_avatar_url) <= MAX_AVATAR_LENGTH, error::invalid_argument(E_AVATAR_TOO_LONG));

        let profile = table::borrow_mut(&mut registry.profiles, sender);
        profile.avatar_url = new_avatar_url;

        event::emit(ProfileUpdated { owner: sender });
    }

    public entry fun update_links(
        account: &signer,
        links: vector<String>,
        link_labels: vector<String>,
    ) acquires Registry {
        let sender = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@profile_registry);

        assert!(table::contains(&registry.profiles, sender), error::not_found(E_PROFILE_NOT_FOUND));
        assert!(vector::length(&links) <= MAX_LINKS, error::invalid_argument(E_TOO_MANY_LINKS));
        assert!(vector::length(&links) == vector::length(&link_labels), error::invalid_argument(E_LINKS_LABELS_MISMATCH));

        let profile = table::borrow_mut(&mut registry.profiles, sender);
        profile.links = links;
        profile.link_labels = link_labels;

        event::emit(ProfileUpdated { owner: sender });
    }

    public entry fun tip_profile(
        account: &signer,
        profile_owner: address,
        metadata: Object<Metadata>,
        amount: u64,
    ) acquires Registry {
        let sender = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@profile_registry);

        assert!(table::contains(&registry.profiles, profile_owner), error::not_found(E_PROFILE_NOT_FOUND));
        assert!(amount >= MIN_TIP_AMOUNT, error::invalid_argument(E_TIP_TOO_SMALL));

        // Transfer coins
        coin::transfer(account, profile_owner, metadata, amount);

        // Update stats
        let profile = table::borrow_mut(&mut registry.profiles, profile_owner);
        profile.total_tips = profile.total_tips + amount;
        profile.tip_count = profile.tip_count + 1;

        // Store tip record
        let (_, timestamp) = block::get_block_info();
        let record = TipRecord {
            from: sender,
            to: profile_owner,
            amount,
            timestamp,
        };

        if (!table::contains(&registry.tip_records, profile_owner)) {
            table::add(&mut registry.tip_records, profile_owner, vector::empty());
        };
        let records = table::borrow_mut(&mut registry.tip_records, profile_owner);
        vector::push_back(records, record);

        event::emit(TipReceived { from: sender, to: profile_owner, amount });
    }

    public entry fun follow_profile(
        account: &signer,
        profile_owner: address,
    ) acquires Registry {
        let sender = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@profile_registry);

        assert!(table::contains(&registry.profiles, profile_owner), error::not_found(E_PROFILE_NOT_FOUND));
        assert!(sender != profile_owner, error::invalid_argument(E_CANNOT_FOLLOW_SELF));

        let key = FollowKey { follower: sender, followed: profile_owner };
        assert!(!table::contains(&registry.follows, key), error::already_exists(E_ALREADY_FOLLOWING));

        // Set follow state
        table::add(&mut registry.follows, key, true);

        // Add to followers list
        if (!table::contains(&registry.followers_list, profile_owner)) {
            table::add(&mut registry.followers_list, profile_owner, vector::empty());
        };
        let followers = table::borrow_mut(&mut registry.followers_list, profile_owner);
        vector::push_back(followers, sender);

        // Add to following list
        if (!table::contains(&registry.following_list, sender)) {
            table::add(&mut registry.following_list, sender, vector::empty());
        };
        let following = table::borrow_mut(&mut registry.following_list, sender);
        vector::push_back(following, profile_owner);

        // Update counts
        let target_profile = table::borrow_mut(&mut registry.profiles, profile_owner);
        target_profile.follower_count = target_profile.follower_count + 1;

        // Sender might not have a profile, only update if they do
        if (table::contains(&registry.profiles, sender)) {
            let sender_profile = table::borrow_mut(&mut registry.profiles, sender);
            sender_profile.following_count = sender_profile.following_count + 1;
        };

        event::emit(Followed { follower: sender, followed: profile_owner });
    }

    public entry fun unfollow_profile(
        account: &signer,
        profile_owner: address,
    ) acquires Registry {
        let sender = signer::address_of(account);
        let registry = borrow_global_mut<Registry>(@profile_registry);

        let key = FollowKey { follower: sender, followed: profile_owner };
        assert!(table::contains(&registry.follows, key), error::not_found(E_NOT_FOLLOWING));

        // Remove follow state
        table::remove(&mut registry.follows, key);

        // Remove from followers list (swap-and-pop)
        let followers = table::borrow_mut(&mut registry.followers_list, profile_owner);
        let (found, idx) = vector::index_of(followers, &sender);
        if (found) {
            vector::swap_remove(followers, idx);
        };

        // Remove from following list (swap-and-pop)
        let following = table::borrow_mut(&mut registry.following_list, sender);
        let (found, idx) = vector::index_of(following, &profile_owner);
        if (found) {
            vector::swap_remove(following, idx);
        };

        // Update counts
        let target_profile = table::borrow_mut(&mut registry.profiles, profile_owner);
        target_profile.follower_count = target_profile.follower_count - 1;

        if (table::contains(&registry.profiles, sender)) {
            let sender_profile = table::borrow_mut(&mut registry.profiles, sender);
            sender_profile.following_count = sender_profile.following_count - 1;
        };

        event::emit(Unfollowed { follower: sender, followed: profile_owner });
    }

    // ========== View functions ==========

    #[view]
    public fun get_profile(owner: address): Profile acquires Registry {
        let registry = borrow_global<Registry>(@profile_registry);
        if (table::contains(&registry.profiles, owner)) {
            *table::borrow(&registry.profiles, owner)
        } else {
            // Return empty profile
            Profile {
                owner,
                bio: std::string::utf8(b""),
                avatar_url: std::string::utf8(b""),
                links: vector::empty(),
                link_labels: vector::empty(),
                total_tips: 0,
                tip_count: 0,
                follower_count: 0,
                following_count: 0,
                created_at: 0,
                exists: false,
            }
        }
    }

    #[view]
    public fun is_following(follower: address, followed: address): bool acquires Registry {
        let registry = borrow_global<Registry>(@profile_registry);
        let key = FollowKey { follower, followed };
        table::contains(&registry.follows, key)
    }

    #[view]
    public fun get_followers(profile_owner: address, offset: u64, limit: u64): vector<address> acquires Registry {
        assert!(limit <= MAX_LIMIT, error::invalid_argument(E_LIMIT_TOO_HIGH));
        let registry = borrow_global<Registry>(@profile_registry);

        if (!table::contains(&registry.followers_list, profile_owner)) {
            return vector::empty()
        };

        let list = table::borrow(&registry.followers_list, profile_owner);
        paginate_vector(list, offset, limit)
    }

    #[view]
    public fun get_following(user: address, offset: u64, limit: u64): vector<address> acquires Registry {
        assert!(limit <= MAX_LIMIT, error::invalid_argument(E_LIMIT_TOO_HIGH));
        let registry = borrow_global<Registry>(@profile_registry);

        if (!table::contains(&registry.following_list, user)) {
            return vector::empty()
        };

        let list = table::borrow(&registry.following_list, user);
        paginate_vector(list, offset, limit)
    }

    #[view]
    public fun get_recent_profiles(offset: u64, limit: u64): vector<address> acquires Registry {
        assert!(limit <= MAX_LIMIT, error::invalid_argument(E_LIMIT_TOO_HIGH));
        let registry = borrow_global<Registry>(@profile_registry);
        let total = vector::length(&registry.all_profiles);

        if (offset >= total) {
            return vector::empty()
        };

        // Return newest first (reverse order)
        let start = total - offset;
        let count = if (start > limit) { limit } else { start };
        let result = vector::empty<address>();
        let i = 0;
        while (i < count) {
            vector::push_back(&mut result, *vector::borrow(&registry.all_profiles, start - 1 - i));
            i = i + 1;
        };
        result
    }

    #[view]
    public fun total_profiles(): u64 acquires Registry {
        let registry = borrow_global<Registry>(@profile_registry);
        vector::length(&registry.all_profiles)
    }

    #[view]
    public fun get_tips_received(owner: address, offset: u64, limit: u64): vector<TipRecord> acquires Registry {
        assert!(limit <= MAX_LIMIT, error::invalid_argument(E_LIMIT_TOO_HIGH));
        let registry = borrow_global<Registry>(@profile_registry);

        if (!table::contains(&registry.tip_records, owner)) {
            return vector::empty()
        };

        let records = table::borrow(&registry.tip_records, owner);
        let total = vector::length(records);

        if (offset >= total) {
            return vector::empty()
        };

        // Return newest first
        let start = total - offset;
        let count = if (start > limit) { limit } else { start };
        let result = vector::empty<TipRecord>();
        let i = 0;
        while (i < count) {
            vector::push_back(&mut result, *vector::borrow(records, start - 1 - i));
            i = i + 1;
        };
        result
    }

    // ========== Internal helpers ==========

    fun paginate_vector(list: &vector<address>, offset: u64, limit: u64): vector<address> {
        let total = vector::length(list);
        if (offset >= total) {
            return vector::empty()
        };

        let end = offset + limit;
        if (end > total) {
            end = total;
        };

        let result = vector::empty<address>();
        let i = offset;
        while (i < end) {
            vector::push_back(&mut result, *vector::borrow(list, i));
            i = i + 1;
        };
        result
    }
}
