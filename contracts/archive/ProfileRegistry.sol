// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ProfileRegistry is ReentrancyGuard {
    struct Profile {
        address owner;
        string bio;
        string avatarUrl;
        string[] links;
        string[] linkLabels;
        uint256 totalTips;
        uint256 tipCount;
        uint256 followerCount;
        uint256 followingCount;
        uint256 createdAt;
        bool exists;
    }

    mapping(address => Profile) public profiles;
    mapping(address => mapping(address => bool)) public follows;
    mapping(address => address[]) public followersList;
    mapping(address => address[]) public followingList;
    address[] public allProfiles;

    event ProfileCreated(address indexed owner);
    event ProfileUpdated(address indexed owner);
    event TipReceived(address indexed from, address indexed to, uint256 amount);
    event Followed(address indexed follower, address indexed followed);
    event Unfollowed(address indexed follower, address indexed followed);

    function createProfile(
        string calldata bio,
        string calldata avatarUrl,
        string[] calldata links,
        string[] calldata linkLabels
    ) external {
        require(!profiles[msg.sender].exists, "Profile already exists");
        require(bytes(bio).length <= 280, "Bio too long");
        require(bytes(avatarUrl).length <= 512, "Avatar URL too long");
        require(links.length <= 10, "Too many links");
        require(links.length == linkLabels.length, "Links and labels mismatch");

        Profile storage p = profiles[msg.sender];
        p.owner = msg.sender;
        p.bio = bio;
        p.avatarUrl = avatarUrl;
        p.links = links;
        p.linkLabels = linkLabels;
        p.createdAt = block.timestamp;
        p.exists = true;

        allProfiles.push(msg.sender);
        emit ProfileCreated(msg.sender);
    }

    function updateBio(string calldata newBio) external {
        require(profiles[msg.sender].exists, "No profile");
        require(bytes(newBio).length <= 280, "Bio too long");
        profiles[msg.sender].bio = newBio;
        emit ProfileUpdated(msg.sender);
    }

    function updateAvatar(string calldata newAvatarUrl) external {
        require(profiles[msg.sender].exists, "No profile");
        require(bytes(newAvatarUrl).length <= 512, "Avatar URL too long");
        profiles[msg.sender].avatarUrl = newAvatarUrl;
        emit ProfileUpdated(msg.sender);
    }

    function updateLinks(
        string[] calldata links,
        string[] calldata linkLabels
    ) external {
        require(profiles[msg.sender].exists, "No profile");
        require(links.length <= 10, "Too many links");
        require(links.length == linkLabels.length, "Links and labels mismatch");
        profiles[msg.sender].links = links;
        profiles[msg.sender].linkLabels = linkLabels;
        emit ProfileUpdated(msg.sender);
    }

    function tipProfile(address profileOwner) external payable nonReentrant {
        require(profiles[profileOwner].exists, "Profile not found");
        require(msg.value >= 0.001 ether, "Min tip 0.001 INIT");

        profiles[profileOwner].totalTips += msg.value;
        profiles[profileOwner].tipCount += 1;

        (bool sent, ) = payable(profileOwner).call{value: msg.value}("");
        require(sent, "Transfer failed");

        emit TipReceived(msg.sender, profileOwner, msg.value);
    }

    function followProfile(address profileOwner) external {
        require(profiles[profileOwner].exists, "Profile not found");
        require(msg.sender != profileOwner, "Cannot follow self");
        require(!follows[msg.sender][profileOwner], "Already following");

        follows[msg.sender][profileOwner] = true;
        followersList[profileOwner].push(msg.sender);
        followingList[msg.sender].push(profileOwner);
        profiles[profileOwner].followerCount += 1;
        profiles[msg.sender].followingCount += 1;

        emit Followed(msg.sender, profileOwner);
    }

    function unfollowProfile(address profileOwner) external {
        require(follows[msg.sender][profileOwner], "Not following");

        follows[msg.sender][profileOwner] = false;

        // Remove from followersList
        address[] storage followers = followersList[profileOwner];
        for (uint256 i = 0; i < followers.length; i++) {
            if (followers[i] == msg.sender) {
                followers[i] = followers[followers.length - 1];
                followers.pop();
                break;
            }
        }

        // Remove from followingList
        address[] storage following = followingList[msg.sender];
        for (uint256 i = 0; i < following.length; i++) {
            if (following[i] == profileOwner) {
                following[i] = following[following.length - 1];
                following.pop();
                break;
            }
        }

        profiles[profileOwner].followerCount -= 1;
        profiles[msg.sender].followingCount -= 1;

        emit Unfollowed(msg.sender, profileOwner);
    }

    // View functions

    function getProfile(address owner) external view returns (Profile memory) {
        return profiles[owner];
    }

    function isFollowing(address follower, address followed) external view returns (bool) {
        return follows[follower][followed];
    }

    function getFollowers(
        address profileOwner,
        uint256 offset,
        uint256 limit
    ) external view returns (address[] memory) {
        require(limit <= 50, "Limit too high");
        address[] storage list = followersList[profileOwner];
        uint256 end = offset + limit;
        if (end > list.length) end = list.length;
        if (offset >= list.length) return new address[](0);

        address[] memory result = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = list[i];
        }
        return result;
    }

    function getFollowing(
        address user,
        uint256 offset,
        uint256 limit
    ) external view returns (address[] memory) {
        require(limit <= 50, "Limit too high");
        address[] storage list = followingList[user];
        uint256 end = offset + limit;
        if (end > list.length) end = list.length;
        if (offset >= list.length) return new address[](0);

        address[] memory result = new address[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = list[i];
        }
        return result;
    }

    function getRecentProfiles(
        uint256 offset,
        uint256 limit
    ) external view returns (address[] memory) {
        require(limit <= 50, "Limit too high");
        uint256 total = allProfiles.length;
        if (offset >= total) return new address[](0);

        // Return newest first
        uint256 start = total > offset ? total - offset : 0;
        uint256 count = start > limit ? limit : start;

        address[] memory result = new address[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = allProfiles[start - 1 - i];
        }
        return result;
    }

    function totalProfiles() external view returns (uint256) {
        return allProfiles.length;
    }
}
