import {
  APIChannel,
  APIThreadMember,
  RESTGetAPIChannelInvitesResult,
  RESTGetAPIChannelMessageResult,
  RESTGetAPIChannelMessagesQuery,
  RESTGetAPIChannelMessagesResult,
  RESTGetAPIChannelPinsResult,
  RESTGetAPIChannelResult,
  RESTGetAPIChannelThreadMembersResult,
  RESTGetAPIChannelThreadsArchivedQuery,
  RESTGetAPIChannelUsersThreadsArchivedResult,
  RESTPatchAPIChannelJSONBody,
  RESTPatchAPIChannelMessageJSONBody,
  RESTPatchAPIChannelMessageResult,
  RESTPatchAPIChannelResult,
  RESTPostAPIChannelFollowersJSONBody,
  RESTPostAPIChannelFollowersResult,
  RESTPostAPIChannelInviteJSONBody,
  RESTPostAPIChannelInviteResult,
  RESTPostAPIChannelMessageCrosspostResult,
  RESTPostAPIChannelMessageJSONBody,
  RESTPostAPIChannelMessageResult,
  RESTPostAPIChannelMessagesBulkDeleteJSONBody,
  RESTPostAPIChannelMessagesThreadsJSONBody,
  RESTPostAPIChannelMessagesThreadsResult,
  RESTPostAPIChannelThreadsJSONBody,
  RESTPostAPIChannelThreadsResult,
  RESTPutAPIChannelPermissionJSONBody,
  RESTPutAPIChannelRecipientJSONBody
} from 'discord-api-types/v9';
import axios from 'axios';

import { CacheManager } from '.';
import { APIVersions } from '../';

class ChannelManager {
  /**
   * Bot's token
   */
  private token: string;

  /**
   * Token type
   */
  private readonly tokenType: string;

  /**
   * Application's cache
   */
  private cache: CacheManager;

  /**
   * API Version
   */
  public readonly version: APIVersions;

  /**
   * @param token - Bot's token
   * @param cache - Application's cache
   * @param version - API Version
   */
  constructor(
    token: string,
    tokenType: string,
    cache: CacheManager,
    version: APIVersions
  ) {
    this.token = token;
    this.tokenType = tokenType;
    this.cache = cache;
    this.version = version;
  }

  /**
   * Get a channel
   * @param channelID - Channel identifiant
   * @returns Channel Object
   */
  public async getChannel(channelID: string): Promise<RESTGetAPIChannelResult> {
    if (this.cache.channels.has(channelID))
      return <APIChannel>this.cache.channels.get(channelID);
    const res = await axios.get<RESTGetAPIChannelResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );

    this.cache.channels.set(channelID, res.data);
    return res.data;
  }

  /**
   * Modify a channel
   * @param channelID - Channel identifiant
   * @param options - Option object
   * @param reason - Reason for the modification
   * @returns - New Channel Object
   */
  public async modifyChannel(
    channelID: string,
    options: RESTPatchAPIChannelJSONBody,
    reason?: string
  ): Promise<RESTPatchAPIChannelResult> {
    const res = await axios.patch<RESTPatchAPIChannelResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}`,
      JSON.stringify(options),
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)',
          'X-Audit-Log-Reason': reason ?? ''
        }
      }
    );

    this.cache.channels.set(channelID, res.data);
    return res.data;
  }

  /**
   * Delete a channel
   * @param channelID - Channel Identifiant
   * @param reason - Reason for the deletion
   */
  public async deleteChannel(
    channelID: string,
    reason?: string
  ): Promise<void> {
    await axios.delete(
      `https://discord.com/api/v${this.version}/channels/${channelID}`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)',
          'X-Audit-Log-Reason': reason ?? ''
        }
      }
    );
    this.cache.channels.delete(channelID);
  }

  /**
   * Get messages from a Channel
   * @param channelID - Channel Identifiant
   * @param options - Options for the query search
   * @returns Array of messages
   */
  public async getChannelMessages(
    channelID: string,
    options?: RESTGetAPIChannelMessagesQuery
  ): Promise<RESTGetAPIChannelMessagesResult> {
    const res = await axios.get<RESTGetAPIChannelMessagesResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/messages`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        },
        params: options
      }
    );
    return res.data;
  }

  /**
   * Get a single message from a channel
   * @param channelID - Channel Identifiant
   * @param messageID - Message Identifiant
   * @returns - Message Object
   */
  public async getChannelMessage(
    channelID: string,
    messageID: string
  ): Promise<RESTGetAPIChannelMessageResult> {
    const res = await axios.get<RESTGetAPIChannelMessageResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/messages/${messageID}`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
    return res.data;
  }

  /**
   * Send a message in a Channel
   * @param channelID - Channel Identifiant
   * @param options - Options for the message sending
   * @returns - Message Object
   */
  public async createMessage(
    channelID: string,
    options: RESTPostAPIChannelMessageJSONBody
  ): Promise<RESTPostAPIChannelMessageResult> {
    const res = await axios.post<RESTPostAPIChannelMessageResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/messages`,
      JSON.stringify(options),
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
    return res.data;
  }

  /**
   * Crosspost a message during the channels who follow the channel
   * @param channelID - Channel Identifiant
   * @param messageID - Message Identifiant
   * @returns - Message Object
   */
  public async crosspostMessage(
    channelID: string,
    messageID: string
  ): Promise<RESTPostAPIChannelMessageCrosspostResult> {
    const res = await axios.post<RESTPostAPIChannelMessageCrosspostResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/messages/${messageID}`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
    return res.data;
  }

  /**
   * Edit a specific message in a channel
   * @param channelID - Channel Identifiant
   * @param messageID - Message Identifiant
   * @param options - Options for the message edition
   * @returns - Message Object
   */
  public async editMessage(
    channelID: string,
    messageID: string,
    options: RESTPatchAPIChannelMessageJSONBody
  ): Promise<RESTPatchAPIChannelMessageResult> {
    const res = await axios.patch<RESTPatchAPIChannelMessageResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/messages/${messageID}`,
      JSON.stringify(options),
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
    return res.data;
  }

  /**
   * Delete a message
   * @param channelID - Channel Identifiant
   * @param messageID - Message Identifiant
   * @param reason - Reason
   */
  public async deleteMessage(
    channelID: string,
    messageID: string,
    reason?: string
  ): Promise<void> {
    await axios.delete(
      `https://discord.com/api/v${this.version}/channels/${channelID}/messages/${messageID}`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)',
          'X-Audit-Log-Reason': reason ?? ''
        }
      }
    );
  }

  /**
   * Delete a group of messages
   * @param channelID - Channel Identifiant
   * @param options - Options for deleting a group of messages
   * @param reason - Reason
   */
  public async bulkDeleteMessages(
    channelID: string,
    options: RESTPostAPIChannelMessagesBulkDeleteJSONBody | number,
    reason?: string
  ): Promise<void> {
    if (typeof options == 'number') {
      options = {
        messages: (
          await this.getChannelMessages(channelID, { limit: options })
        ).map((m) => m.id)
      };
    }
    await axios.post(
      `https://discord.com/api/v${this.version}/channels/${channelID}/messages/bulk-delete`,
      JSON.stringify(options),
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)',
          'X-Audit-Log-Reason': reason ?? ''
        }
      }
    );
  }

  /**
   * Edit a permission
   * @param channelID - Channel Identifiant
   * @param overwriteID - Role or User Identifiant
   * @param options - Options to edit a permission
   * @param reason - Reason
   */
  public async editChannelPermissions(
    channelID: string,
    overwriteID: string,
    options: RESTPutAPIChannelPermissionJSONBody,
    reason?: string
  ): Promise<void> {
    await axios.put(
      `https://discord.com/api/v${this.version}/channels/${channelID}/permissions/${overwriteID}`,
      JSON.stringify(options),
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)',
          'X-Audit-Log-Reason': reason ?? ''
        }
      }
    );
  }

  /**
   * Get all channel invitations
   * @param channelID - Channel Identifiant
   * @returns - List of Invitation Object
   */
  public async getChannelInvites(
    channelID: string
  ): Promise<RESTGetAPIChannelInvitesResult> {
    const res = await axios.get<RESTGetAPIChannelInvitesResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/invites`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
    return res.data;
  }

  /**
   * Create an invitation
   * @param channelID - Channel Invitation
   * @param options - Options to create an invitation
   * @param reason - Reason
   * @returns - Invitation Object
   */
  public async createChannelInvite(
    channelID: string,
    options: RESTPostAPIChannelInviteJSONBody = {},
    reason?: string
  ): Promise<RESTPostAPIChannelInviteResult> {
    const res = await axios.post<RESTPostAPIChannelInviteResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/invites`,
      JSON.stringify(options),
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)',
          'X-Audit-Log-Reason': reason ?? ''
        }
      }
    );

    return res.data;
  }

  /**
   * Delete a permission
   * @param channelID - Channel Identification
   * @param overwriteID - User or Role Identification
   * @param reason - Reason
   */
  public async deleteChannelPermission(
    channelID: string,
    overwriteID: string,
    reason?: string
  ): Promise<void> {
    await axios.delete(
      `https://discord.com/api/v${this.version}/channels/${channelID}/permissions/${overwriteID}`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)',
          'X-Audit-Log-Reason': reason ?? ''
        }
      }
    );
  }

  /**
   * Follow a news channel
   * @param channelID - Channel Identifiant
   * @param options - Options to follow a news channel
   * @returns - Followed Channel Object
   */
  public async followNewsChannel(
    channelID: string,
    options: RESTPostAPIChannelFollowersJSONBody
  ): Promise<RESTPostAPIChannelFollowersResult> {
    const res = await axios.post<RESTPostAPIChannelFollowersResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/followers`,
      JSON.stringify(options),
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
    return res.data;
  }

  /**
   * Trigger typing indicator in a channel
   * @param channelID - Channel Identifiant
   */
  public async triggerTypingIndicator(channelID: string): Promise<void> {
    await axios.post(
      `https://discord.com/api/v${this.version}/channels/${channelID}/typing`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
  }

  /**
   * Get the list of pinned messages
   * @param channelID - Channel Identifiant
   * @returns - List of messages object
   */
  public async getPinnedMessages(
    channelID: string
  ): Promise<RESTGetAPIChannelPinsResult> {
    const res = await axios.get<RESTGetAPIChannelPinsResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/pins`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
    return res.data;
  }

  /**
   * Pin a message
   * @param channelID - Channel Identifiant
   * @param messageID - Message Identifiant
   * @param reason - Reason
   */
  public async pinMessage(
    channelID: string,
    messageID: string,
    reason?: string
  ): Promise<void> {
    await axios.put(
      `https://discord.com/api/v${this.version}/channels/${channelID}/pins/${messageID}`,
      '',
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)',
          'X-Audit-Log-Reason': reason ?? ''
        }
      }
    );
  }

  /**
   * Unpin a message
   * @param channelID - Channel Identifiant
   * @param messageID - Message Identifiant
   * @param reason - Reason
   */
  public async unpinMessage(
    channelID: string,
    messageID: string,
    reason?: string
  ): Promise<void> {
    await axios.delete(
      `https://discord.com/api/v${this.version}/channels/${channelID}/pins/${messageID}`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)',
          'X-Audit-Log-Reason': reason ?? ''
        }
      }
    );
  }

  /**
   * Add someone to a DM group
   * @param channelID - Channel Identifiant
   * @param userID - User Identifiant
   * @param options - Options to add someone to a DM group
   */
  public async groupDMAddRecipient(
    channelID: string,
    userID: string,
    options: RESTPutAPIChannelRecipientJSONBody
  ): Promise<void> {
    await axios.put(
      `https://discord.com/api/v${this.version}/channels/${channelID}/recipients/${userID}`,
      JSON.stringify(options),
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
  }

  /**
   * Remove someone to a DM group
   * @param channelID - Channel Identifiant
   * @param userID - User Identifiant
   */
  public async groupDMRemoveRecipient(
    channelID: string,
    userID: string
  ): Promise<void> {
    await axios.delete(
      `https://discord.com/api/v${this.version}/channels/${channelID}/recipients/${userID}`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
  }

  /**
   * Create a thread with a message
   * @param channelID - Channel Identifiant
   * @param messageID - Message Identifiant
   * @param options - Options to create a thread
   * @param reason - Reason
   * @returns - ThreadChannel Object
   */
  public async startThreadWithMessages(
    channelID: string,
    messageID: string,
    options: RESTPostAPIChannelMessagesThreadsJSONBody,
    reason?: string
  ): Promise<RESTPostAPIChannelMessagesThreadsResult> {
    const res = await axios.post<RESTPostAPIChannelMessagesThreadsResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/messages/${messageID}/threads`,
      JSON.stringify(options),
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)',
          'X-Audit-Log-Reason': reason ?? ''
        }
      }
    );
    return res.data;
  }

  /**
   * Create a thread
   * @param channelID - Channel Identifiant
   * @param options - Option to create a thread
   * @param reason - Reason
   * @returns - ThreadChannel Object
   */
  public async startThreadWithoutMessages(
    channelID: string,
    options: RESTPostAPIChannelThreadsJSONBody,
    reason?: string
  ): Promise<RESTPostAPIChannelThreadsResult> {
    const res = await axios.post<RESTPostAPIChannelThreadsResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/threads`,
      JSON.stringify(options),
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)',
          'X-Audit-Log-Reason': reason ?? ''
        }
      }
    );
    return res.data;
  }

  /**
   * Join a thread
   * @param channelID - Channel Identifiant
   */
  public async joinThread(channelID: string): Promise<void> {
    await axios.put(
      `https://discord.com/api/v${this.version}/channels/${channelID}/thread-members/@me`,
      '',
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
  }

  /**
   * Add someone to a thread
   * @param channelID - Channel Identifiant
   * @param userID - User Identifiant
   */
  public async addThreadMember(
    channelID: string,
    userID: string
  ): Promise<void> {
    await axios.put(
      `https://discord.com/api/v${this.version}/channels/${channelID}/thread-members/${userID}`,
      '',
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
  }

  /**
   * Leave a thread
   * @param channelID - Channel Identifiant
   */
  public async leaveThread(channelID: string): Promise<void> {
    await axios.delete(
      `https://discord.com/api/v${this.version}/channels/${channelID}/thread-members/@me`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
  }

  /**
   * Remove someone to a thread
   * @param channelID - Channel Identifiant
   * @param userID - User Identifant
   */
  public async removeThreadMember(
    channelID: string,
    userID: string
  ): Promise<void> {
    await axios.delete(
      `https://discord.com/api/v${this.version}/channels/${channelID}/thread-members/${userID}`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
  }

  /**
   * Get the thread of a member
   * @param channelID - Channel Identifiant
   * @param userID - User Identifiant
   * @returns - Thread Member Object
   */
  public async getThreadMember(
    channelID: string,
    userID: string
  ): Promise<APIThreadMember> {
    const res = await axios.get<APIThreadMember>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/thread-members/${userID}`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
    return res.data;
  }

  /**
   * List all the members of a thread
   * @param channelID - Channel Identifiant
   * @returns - List of Thread Member Object
   */
  public async listThreadMembers(
    channelID: string
  ): Promise<RESTGetAPIChannelThreadMembersResult> {
    const res = await axios.get<RESTGetAPIChannelThreadMembersResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/thread-members`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        }
      }
    );
    return res.data;
  }

  /**
   * List all public the archived public thread
   * @param channelID - Channel Identifiant
   * @param options - Option to list all the archived public thread
   * @returns - List of Thread Channels
   */
  public async listPublicArchivedThreads(
    channelID: string,
    options: RESTGetAPIChannelThreadsArchivedQuery
  ): Promise<RESTGetAPIChannelUsersThreadsArchivedResult> {
    const res = await axios.get<RESTGetAPIChannelUsersThreadsArchivedResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/threads/archived/public`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        },
        params: options
      }
    );
    return res.data;
  }

  /**
   * List all public the archived private thread
   * @param channelID - Channel Identifiant
   * @param options - Option to list all the archived private thread
   * @returns - List of Thread Channels
   */
  public async listPrivateArchivedThreads(
    channelID: string,
    options: RESTGetAPIChannelThreadsArchivedQuery
  ): Promise<RESTGetAPIChannelUsersThreadsArchivedResult> {
    const res = await axios.get<RESTGetAPIChannelUsersThreadsArchivedResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/threads/archived/private`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        },
        params: options
      }
    );
    return res.data;
  }

  /**
   * List all public the archived private joined thread
   * @param channelID - Channel Identifiant
   * @param options - Option to list all the archived private joined thread
   * @returns - List of Thread Channels
   */
  public async listJoinedPrivateArchivedThreads(
    channelID: string,
    options: RESTGetAPIChannelThreadsArchivedQuery
  ): Promise<RESTGetAPIChannelUsersThreadsArchivedResult> {
    const res = await axios.get<RESTGetAPIChannelUsersThreadsArchivedResult>(
      `https://discord.com/api/v${this.version}/channels/${channelID}/users/@me/threads/archived/private`,
      {
        headers: {
          Authorization: `${this.tokenType} ${this.token}`,
          'Content-Type': 'application/json',
          'User-Agent':
            'Higa (https://github.com/fantomitechno/Higa, 1.0.0-dev)'
        },
        params: options
      }
    );
    return res.data;
  }
}

export { ChannelManager };
